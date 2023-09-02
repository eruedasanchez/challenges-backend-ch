import __dirname from '../utils.js';
import express from 'express';
export const router = express.Router();
import path from 'path';
import fs from 'fs';
import {serverSocket} from '../app.js';
import products from "../data/products.json" assert {type: "json"};

let route = path.join(__dirname, 'data', 'products.json');

const getProducts = () => {
    if(!fs.existsSync(route)) return [];
    
    return JSON.parse(fs.readFileSync(route, 'utf-8'));
}

const saveProducts = (products) => {
    fs.writeFileSync(route, JSON.stringify(products, null, '\t'));
}

// router.get('/',(req,res)=>{
//     res.setHeader('Content-Type','application/json');
//     res.status(200).json(products);
// });

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

    let products = getProducts();
    
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



