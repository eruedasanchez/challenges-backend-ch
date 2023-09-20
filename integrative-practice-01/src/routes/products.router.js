import express from 'express';
import mongoose from 'mongoose';
import MongoProductManager from '../dao/mongoDB-manager/MongoProductManager.js';
export const router = express.Router();

const mongoProductManager = new MongoProductManager();

/*------------------------------*\
        #MIDDLEWARES GET '/'
\*------------------------------*/

const noLimitMid = async (req, res, next) => {
    let products = await mongoProductManager.getProducts();
    
    if(Object.keys(req.query).length === 0) return res.status(200).json({status:'ok', MongoDBProducts:products}); 
    
    next();
}

const nanLimitMid = (req, res, next) => {
    let {limit} = req.query;
    
    if(isNaN(limit)) return res.status(400).json({status:'error', message:'El argumento LIMIT es de tipo numerico'});

    next();
}

const limitInvalidMid = async (req, res, next) => {
    let products = await mongoProductManager.getProducts();
    let {limit} = req.query;
    
    if(parseInt(limit) < 1 || parseInt(limit) > products.length){
        return res.status(400).send(`Error. LIMIT ${limit} no esta permitido. Por favor, ingrese un LIMIT entre 1 y ${products.length} inclusive`)
    }

    next();
}

/*------------------------------*\
    #MIDDLEWARES GET '/:pid'
\*------------------------------*/

const invalidObjectIdMid = (req, res, next) => {
    let pid = req.params.pid;
    
    if(!mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({error:'El pid ingresado tiene un formato invalido'});

    next();
}

const invalidPidMid = async (req, res, next) => {
    let products = await mongoProductManager.getProducts();
    let pid = req.params.pid;
    
    let prodId = products.filter(product => product._id.equals(new mongoose.Types.ObjectId(pid)));
    
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
        return res.status(400).json({status: 'error', error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
    }

    next();
}

const sameCodeMid = async (req, res, next) => {
    let {code} = req.body;
    
    const productWithSameCode = await mongoProductManager.findByCode(code); 
    if(productWithSameCode){
        return res.status(400).json({status: 'error', error:'No se permiten agregar productos distintos que tengan el mismo codigo'});
    }

    next();
}

const priceStockNegMid = (req, res, next) => {
    let {price, stock} = req.body;

    if(price <= 0 || stock <= 0){
        return res.status(400).json({status: 'error', error:'Los campos price y stock deben ser positivos.'});
    }

    next();
}

/*------------------------------*\
    #MIDDLEWARES PUT '/:pid'
\*------------------------------*/

const emptyFieldsModifyMid = (req, res, next) => {
    let fieldsToModify = req.body;

    for(const value of Object.values(fieldsToModify)){
        if(!value){
            return res.status(400).json({status: 'error', error:'Todos los campos que desea modificar tienen que estar completos.'});
        }
    }
    
    next();
}

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

router.get('/', noLimitMid, nanLimitMid, limitInvalidMid, async (req, res) => {
    try {
        // Desestructuracion del query param limit
        let {limit} = req.query;
        let limitedProducts = await mongoProductManager.getLimitedProducts(limit);
        res.status(201).json({status: 'ok', MongoDBProducts:limitedProducts})    
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message})
    }
})

router.get('/:pid', invalidObjectIdMid, invalidPidMid, async (req, res) => {
    try {
        let pid = req.params.pid;
        
        let productSelected = await mongoProductManager.getProductById(pid); 
        res.status(200).json({status:'ok', MongoDBProduct:productSelected});                           
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.post('/', emptyFieldMid, sameCodeMid, priceStockNegMid, async (req,res) => {
    try {
        let newProd = req.body;
        let productAdded = await mongoProductManager.addProduct(newProd);

        res.status(201).json({status: 'ok', newProduct:productAdded})
        
    } catch (error) {
        res.status(500).json({error:'Error inesperado', detalle:error.message})
        
    }
})

router.put('/:pid', invalidObjectIdMid, invalidPidMid, emptyFieldsModifyMid, sameCodeMid, priceStockNegMid, async (req, res) => {
    try {
        let pid = req.params.pid;
        let fields = req.body;

        let updatedProds = await mongoProductManager.updateProduct(pid, fields);
    
        res.status(200).json({status: 'ok', updatedProducts: updatedProds});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.delete('/:pid', invalidObjectIdMid, invalidPidMid, async (req,res) => {
    try {
        let pid = req.params.pid;
        let delProduct = await mongoProductManager.deleteProduct(pid);
    
        res.status(200).json({status: 'ok', deletedProduct: delProduct});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})