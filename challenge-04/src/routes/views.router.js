import __dirname from '../utils.js';
import express from 'express';
export const router = express.Router();
import path from 'path';
import fs from 'fs';
import {serverSocket} from '../app.js';

let route = path.join(__dirname, 'data', 'products.json');

const getProducts = () => {
    if(!fs.existsSync(route)) return [];
    
    return JSON.parse(fs.readFileSync(route, 'utf-8'));
}

const saveProducts = (products) => {
    fs.writeFileSync(route, JSON.stringify(products, null, '\t'));
}

router.get('/',(req,res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts');
});

// Creacion de un nuevo producto
router.post('/',(req,res)=>{
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
    }
    
    if(isNaN(price) || price <= 0) return res.status(400).json({error:'El precio debe ser numerico y mayor (estricto) que 0'});

    let products = getProducts();

    let codes = [];
    for(const prod of products){
        codes.push(prod.code);
    }
    
    // Se chequea que el codigo ingresado no se encuentre repetido
    if(codes.includes(code)) return res.status(400).json({error:`El codigo ${code} ya se encuentra asignado a otro producto. Por favor, ingrese uno distinto`});
    
    let id = 1;
    if(products.length > 0) id = products[products.length-1].id + 1;

    let newProduct = {
        id: id, 
        title: title, 
        description: description, 
        code: code, 
        price: price, 
        status: status, 
        stock: stock, 
        category: category, 
        thumbnails: thumbnails 
    }

    products.push(newProduct);

    saveProducts(products);

    serverSocket.emit('newProduct', newProduct, products);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).json(newProduct);
})

// Eliminacion de un producto
router.delete('/:pid', (req,res) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({error:'El pid debe ser numerico'});
    
    let products = getProducts();
    let idxDeletedProduct = products.findIndex(prod => prod.id === pid);

    if(idxDeletedProduct === -1) return res.status(400).json({error:`El producto con ID ${pid} no existe`});
    
    let deletedProduct = (products.splice(idxDeletedProduct, 1))[0]; // Se captura al objeto que contiene al producto eliminado del arreglo deletedProduct

    saveProducts(products);

    serverSocket.emit('deletedProduct', deletedProduct, products);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).json(deletedProduct);
})



