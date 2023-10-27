import express from 'express';
import mongoose from 'mongoose';
import MongoCartManager from '../dao/mongoDB-manager/MongoCartManager.js';
export const router = express.Router();

const mongoCartManager = new MongoCartManager();

/*------------------------------*\
    #MIDDLEWARES GET '/:cid'
\*------------------------------*/

const invalidObjectCidMid = (req, res, next) => {
    let cid = req.params.cid;
    
    if(!mongoose.Types.ObjectId.isValid(cid)) return res.status(400).json({status:'error', error:'El cartId ingresado tiene un formato invalido'});

    next();
}

const invalidCidMid = async (req, res, next) => {
    let carts = await mongoCartManager.getCarts();
    let cid = req.params.cid;
    
    let cartCid = carts.filter(cart => cart._id.equals(new mongoose.Types.ObjectId(cid)));
    
    if(cartCid.length === 0){
        return res.status(400).json({status:'error', message:`El carrito con CID ${cid} no existe`}); 
    }

    next();
}

/*------------------------------------------*\
    #MIDDLEWARES POST '/:cid/product/:pid'
\*------------------------------------------*/

const nanPidMid = (req, res, next) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({status:'error', message:'Se requiere argumento pid de tipo numerico'});

    next();
}

const negativePidMid = (req, res, next) => {
    let pid = parseInt(req.params.pid);

    if(pid < 1) return res.status(400).json({status:'error', message:`El PID ${pid} es invalido. Deben ser mayores o iguales a 1`});

    next();
}

/*------------------------------*\
        #CART ROUTES
\*------------------------------*/

router.post('/', async (req,res) => {
    try {
        let cartAdded = await mongoCartManager.createCart();
        res.status(200).json({status: 'ok', newCart:cartAdded})
    } catch (error) {
        res.status(500).json({error:'Error inesperado', detalle:error.message})
        
    }
})

router.get('/:cid', invalidObjectCidMid, invalidCidMid, async (req, res) => {
    try {
        let cid = req.params.cid;
        let cartSelected = await mongoCartManager.getCartById(cid); 
        res.status(200).json({status:'ok', MongoDBCart:cartSelected});                           
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.post('/:cid/product/:pid', invalidObjectCidMid, invalidCidMid, nanPidMid, negativePidMid, async (req,res) => {
    try {
        let cid = req.params.cid, pid = parseInt(req.params.pid);
        
        let cartSel = await mongoCartManager.addProduct(cid, pid);
        res.status(200).json({status: 'ok', cartSelected:cartSel});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

