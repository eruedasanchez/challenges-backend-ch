import __dirname from '../utils.js';
import path from 'path';
import express from 'express';
import CartManager from '../dao/fs-manager/CartManager.js';
export const router = express.Router();

const route = path.join(__dirname, 'data', 'cart.json');
const cartManager = new CartManager(route);

/*------------------------------*\
    #MIDDLEWARES GET '/:cid'
\*------------------------------*/

const nanMid = (req, res, next) => {
    let cid = parseInt(req.params.cid);
    
    if(isNaN(cid)) return res.status(400).json({status:'error', message:'Requiere un argumento cid de tipo numerico'});

    next();
}

const invalidPidMid = (req, res, next) => {
    let cart = cartManager.getCarts();
    let cid = parseInt(req.params.cid);
    
    let cartSelected = cart.filter(cart => cart.cartId === cid);
    if(cartSelected.length === 0){
        return res.status(400).json({status:'error', message:`El carrito con CID ${cid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/carts/34123123
    }

    next();
}

/*------------------------------------------*\
    #MIDDLEWARES POST '/:cid/product/:pid'
\*------------------------------------------*/

const nanCidPid = (req, res, next) => {
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    
    if(isNaN(cid) || isNaN(pid)) return res.status(400).json({status:'error', message:'Se requieren argumentos cid y pid de tipo numerico'});

    next();
}

const pidInvalid = (req, res, next) => {
    let pid = parseInt(req.params.pid);

    if(pid < 1) return res.status(400).json({status:'error', message:`El PID ${pid} es invalido. Deben ser mayores o iguales a 1`});

    next();
}

const invalidCidMid = (req, res, next) => {
    let cart = cartManager.getCarts();
    let cid = parseInt(req.params.cid);
    
    let idxCart = cart.findIndex(cart => cart.cartId === cid);
    if(idxCart === -1) return res.status(400).json({error:`El carrito con CID ${cid} no existe`});

    next();
}

/*------------------------------*\
        #CART ROUTES
\*------------------------------*/

router.post('/', (req,res) => {
    cartManager.createCart();
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({status: 'ok'});
})

router.get('/:cid', nanMid, invalidPidMid, (req, res) => {
    let cid = parseInt(req.params.cid);
    let cartSelected = cartManager.getCartById(cid);
    
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({status:'ok', cartProducts: cartSelected.products});                              // Caso en el que se cumple http://localhost:8080/api/carts/2
})

router.post('/:cid/product/:pid', nanCidPid, pidInvalid, invalidCidMid, (req,res) => {
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);

    cartManager.addProduct(cid, pid);
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({status: 'ok'});
})

