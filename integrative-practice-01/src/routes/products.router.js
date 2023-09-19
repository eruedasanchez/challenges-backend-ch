import fs from 'fs';
import __dirname from '../utils.js';
import path from 'path';
import express from 'express';
import ProductManager from '../dao/fs-manager/ProductManager.js';
export const router = express.Router();

const route = path.join(__dirname, 'data', 'products.json');
const productManager = new ProductManager(route);

const save = (products) => {
    fs.writeFileSync(route, JSON.stringify(products, null, '\t'));
}

/*------------------------------*\
        #MIDDLEWARES GET '/'
\*------------------------------*/

const limitInvalidMid = (req, res, next) => {
    let products = productManager.getProducts();
    let {limit} = req.query;
    
    
    if(parseInt(limit) < 1 || parseInt(limit) > products.length){
        return res.status(400).send(`Error. LIMIT ${limit} no esta permitido. Por favor, ingrese un LIMIT entre 1 y ${products.length} inclusive`)
    }

    next();
}

const noLimitMid = (req, res, next) => {
    let products = productManager.getProducts();

    if(Object.keys(req.query).length === 0){
        // No se pasan query params por URL
        return res.status(200).json({status:'ok', prods:products}); 
    }

    next();
}

/*------------------------------*\
    #MIDDLEWARES GET '/:pid'
\*------------------------------*/

const nanMid = (req, res, next) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({status:'error', message:'Requiere un argumento id de tipo numerico'});

    next();
}

const invalidPidMid = (req, res, next) => {
    let products = productManager.getProducts();
    let pid = parseInt(req.params.pid);
    let prodId = products.filter(product => product.id === pid);

    if(prodId.length === 0){
        return res.status(400).json({status:'error', message:`El producto con ID ${pid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/products/34123123
    }

    next();
}

/*------------------------------*\
        #MIDDLEWARES POST '/'
\*------------------------------*/

const emptyFieldMid = (req, res, next) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
    }

    next();
}

const sameCodeMid = (req, res, next) => {
    let {code} = req.body;

    let products = productManager.getProducts();
    const productWithSameCode = products.filter((prod) => prod.code === code); 
    
    if(productWithSameCode.length > 0){
        return res.status(400).json({error:'No se permiten agregar productos distintos que tengan el mismo codigo'});
    }

    next();
}

const priceStockNegMid = (req, res, next) => {
    let {price, stock} = req.body;

    if(price <= 0 || stock <= 0){
        return res.status(400).json({error:'Los campos price y stock deben ser positivos.'});
    }

    next();
}

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

router.get('/', limitInvalidMid, noLimitMid, (req, res) => {
    let products = productManager.getProducts();
    
    // Desestructuracion del query param limit
    let {limit} = req.query;
    let limitedProducts = products.slice(0, parseInt(limit));
    
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({status:'ok', prods:limitedProducts});
})

router.get('/:pid', nanMid, invalidPidMid, (req, res) => {
    let pid = parseInt(req.params.pid);
    
    let productSelected = productManager.getProductById(pid); 
    return res.status(200).json({status:'ok', dataProduct:productSelected});                             
    
})

router.post('/', emptyFieldMid, sameCodeMid, priceStockNegMid, (req,res) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;
    
    productManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    
    res.status(200).json({status: 'ok'});
})

router.put('/:pid', nanMid, invalidPidMid, sameCodeMid, priceStockNegMid, (req, res) => {
    let pid = parseInt(req.params.pid);
    let fieldsToUpdate = req.body;

    productManager.updateProduct(pid, fieldsToUpdate);

    res.status(200).json({status: 'ok', fieldsUpdate:fieldsToUpdate});
})

router.delete('/:pid', nanMid, invalidPidMid, (req,res) => {
    let pid = parseInt(req.params.pid);

    productManager.deleteProduct(pid);
    
    res.status(200).json({status: 'ok'});
})