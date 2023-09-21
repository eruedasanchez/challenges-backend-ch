// import fs from 'fs';
// import __dirname from '../utils.js';
// import path from 'path';

import express from 'express';
import mongoose from 'mongoose';
import MongoChatManager from '../dao/mongoDB-manager/MongoChatManager.js';
import { serverSocket } from '../app.js';
export const router = express.Router();

const mongoChatManager = new MongoChatManager();

/*------------------------------*\
        #CHAT ROUTES
\*------------------------------*/

router.get('/', (req, res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat', { header: 'Inicio | Chat' });
});

// Mensaje que va a emitir el backend al frontend
let mensajes=[{
    emisor:'Server',
    mensaje:'Bienvenido al chat del curso Backend...!!!'
}];

let usuarios=[];

export const initChat = (serverSocketChat) => {
    serverSocketChat.on('connection', socket => {
        console.log(`Se ha conectado un cliente con ID ${socket.id}`);
        
        socket.on('userEmail', userEmail => {
            console.log(userEmail);
        
            // colocamos a los clientes que se van conectando en un arreglo para luego saber quien se desconecta
            usuarios.push({
                id: socket.id,
                userEmail: userEmail
            })

            // el server le notifica al ulitmo cliente el mensaje de bienvenida (.emit)
            socket.emit('bienvenida', mensajes);

            // el server notifica/emite a todos menos al ultimo que se sumo (broadcast.emit), o sea, al nuevo, los clientes/frontend que se sumo un nuevo usuario
            socket.broadcast.emit('nuevoUsuario', userEmail);
        })

        // el server recibe el nuevo mensaje enviado por el cliente
        socket.on('nuevoMensaje', mensaje => {
            mensajes.push(mensaje); // se almacena el msj para que cada usuario nuevo pueda ver la conversacion

            serverSocketChat.emit('llegoMensaje', mensaje); // con serverSocketChat, el server el emite a todos los cliente el mensaje
        })

        // la desconexion ocurre cuando un cliente cerra su ventana o navegador
        socket.on('disconnect',() => {
            console.log(`se desconecto el cliente con id ${socket.id}`);
            let indice = usuarios.findIndex(usuario => usuario.id === socket.id);
            let usuario = usuarios[indice];
            serverSocketChat.emit('usuarioDesconectado', usuario);
            usuarios.splice(indice, 1);
        })
    })
}

// /*------------------------------*\
//         #MIDDLEWARES POST '/'
// \*------------------------------*/

// const emptyFieldMid = (req, res, next) => {
//     let {title, description, code, price, status, stock, category, thumbnails} = req.body;

//     if(!title || !description || !code || !price || !status || !stock || !category){
//         return res.status(400).json({error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
//     }

//     next();
// }

// const sameCodeMid = (req, res, next) => {
//     let {code} = req.body;

//     let products = productManager.getProducts();
//     const productWithSameCode = products.filter((prod) => prod.code === code); 
    
//     if(productWithSameCode.length > 0){
//         return res.status(400).json({error:'No se permiten agregar productos distintos que tengan el mismo codigo'});
//     }

//     next();
// }

// const priceStockNegMid = (req, res, next) => {
//     let {price, stock} = req.body;

//     if(price <= 0 || stock <= 0){
//         return res.status(400).json({error:'Los campos price y stock deben ser positivos.'});
//     }

//     next();
// }

// /*-----------------------------------*\
//     #MIDDLEWARES DELETE '/:pid'
// \*-----------------------------------*/

// const nanMid = (req, res, next) => {
//     let pid = parseInt(req.params.pid);
    
//     if(isNaN(pid)) return res.status(400).json({status:'error', message:'Requiere un argumento id de tipo numerico'});

//     next();
// }

// const invalidPidMid = (req, res, next) => {
//     let products = productManager.getProducts();
//     let pid = parseInt(req.params.pid);
//     let prodId = products.filter(product => product.id === pid);

//     if(prodId.length === 0){
//         return res.status(400).json({status:'error', message:`El producto con ID ${pid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/products/34123123
//     }

//     next();
// }

// /*------------------------------*\
//         #VIEWS ROUTES
// \*------------------------------*/

// router.get('/', (req, res) => {
//     res.setHeader('Content-Type','text/html');
//     res.status(200).render('realTimeProducts');
// });

// // Creacion de un nuevo producto
// router.post('/', emptyFieldMid, sameCodeMid, priceStockNegMid, (req, res) => {
//     let {title, description, code, price, status, stock, category, thumbnails} = req.body;

//     let products = productManager.getProducts();
    
//     let id = 1;
//     if(products.length > 0) id = products[products.length-1].id + 1;

//     let newProduct = {
//         id: id, 
//         title: title, 
//         description: description, 
//         code: code, 
//         price: price, 
//         status: status, 
//         stock: stock, 
//         category: category, 
//         thumbnails: thumbnails 
//     }

//     products.push(newProduct);

//     save(products);

//     serverSocket.emit('newProduct', newProduct, products);

//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).json({product: newProduct});
// })

// // Eliminacion de un producto
// router.delete('/:pid', nanMid, invalidPidMid, (req,res) => {
//     let pid = parseInt(req.params.pid);
    
//     let products = productManager.getProducts();
//     let idxDeletedProduct = products.findIndex(prod => prod.id === pid);
    
//     let deletedProduct = products.splice(idxDeletedProduct, 1);

//     save(products);

//     serverSocket.emit('deletedProduct', deletedProduct, products);

//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).json({deletedProduct});
// })



