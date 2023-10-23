import express from 'express';
import mongoose from 'mongoose';
import MongoCartManager from '../dao/mongoDB-manager/MongoCartManager.js';
import MongoProductManager from '../dao/mongoDB-manager/MongoProductManager.js';
export const router = express.Router();

const mongoCartManager = new MongoCartManager();
const mongoProductManager = new MongoProductManager();

/*------------------------------*\
    #MIDDLEWARES GET '/:cid'
\*------------------------------*/

const invalidObjectCidMid = (req, res, next) => {
    let cid = req.params.cid;
    
    if(!mongoose.Types.ObjectId.isValid(cid)) return res.status(400).json({status:'error', error:'El pid ingresado tiene un formato invalido'});

    next();
}

const inexistsCidMid = async (req, res, next) => {
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

const invalidObjectPidMid = (req, res, next) => {
    let pid = req.params.pid;
    
    if(!mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({status:'error', error:'El PID ingresado tiene un formato invalido'});

    next();
}

const inexistsPidMid = async (req, res, next) => {
    let products = await mongoProductManager.getProducts();
    let pid = req.params.pid;
    
    let productPid = products.filter(product => product._id.equals(new mongoose.Types.ObjectId(pid)));
    
    if(productPid.length === 0){
        return res.status(400).json({status:'error', message:`El carrito con CID ${cid} no existe`}); 
    }
    
    next();
}

/*------------------------------------------*\
    #MIDDLEWARES DELETE '/:cid/product/:pid'
\*------------------------------------------*/

const inexistsPidInProductCartMid = async (req, res, next) => {
    let cid = req.params.cid;
    let pid = req.params.pid;

    let cartSelected = await mongoCartManager.getCartByIdWithoutPopulate(cid);
    let productsSelected = cartSelected.products;
    let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));
    
    if(idxPid === -1){
        return res.status(400).json({status:'error', message:`El producto con PID ${pid} no existe en el carrito con CID ${cid}.`});
    }
    
    next();
}

/*------------------------------------------*\
            #MIDDLEWARES PUT '/:cid'
\*------------------------------------------*/

const emptyFieldProductsMid = async (req, res, next) => {
    let inputProducts = req.body;
    
    const newProducts = inputProducts.products;
    for(const prod of newProducts){
        if(!prod.productId || !prod.quantity){
            return res.status(400).json({status:'error', message:`Cada producto del arreglo products ingresado por el body debe tener obligatoriamente los campos productId y quantity completos.`});
        }
    }
    
    next();
}

const invalidObjectProductIdMid = (req, res, next) => {
    let inputProducts = req.body;
    
    const newProducts = inputProducts.products;
    for(const prod of newProducts){
        if(!mongoose.Types.ObjectId.isValid(prod.productId)){
            return res.status(400).json({status:'error', error:'Todos los productId ingresados deben ser de tipo ObjectId'});
        }
    }
    next();
}

const negativeQuantityMid = async (req, res, next) => {
    let inputProducts = req.body;
    
    const newProducts = inputProducts.products;
    for(const prod of newProducts){
        if(prod.quantity < 1){
            return res.status(400).json({status:'error', message:`Solo se admiten cantidades positivas en cada uno de los productos ingresados.`});
        }
    }
    next();
}

const quantityNegMid = async (req, res, next) => {
    let fields = req.body;
    
    if(fields.quantity < 1){
            return res.status(400).json({status:'error', message:`El campo quantity solo admite cantidades positivas.`});
        }
    
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

router.get('/:cid', invalidObjectCidMid, inexistsCidMid, async (req, res) => {
    try {
        let cid = req.params.cid;
        let cartSelected = await mongoCartManager.getCartById(cid); 
        
        res.status(201).json({status:'ok', MongoDBCart:cartSelected});                           
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.post('/:cid/product/:pid', invalidObjectCidMid, inexistsCidMid, invalidObjectPidMid, inexistsPidMid, invalidObjectProductIdMid, async (req,res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        
        let cartSel = await mongoCartManager.addProduct(cid, pid);
        res.status(200).json({status: 'ok', cartSelected:cartSel});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.put('/:cid', invalidObjectCidMid, inexistsCidMid, emptyFieldProductsMid, invalidObjectProductIdMid, negativeQuantityMid, async (req,res) => {
    try {
        let cid = req.params.cid;
        let prods = req.body;
        
        let updatedProds = await mongoCartManager.updateProducts(cid, prods);
        res.status(200).json({status: 'ok', updatedProducts: updatedProds}); 
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.put('/:cid/product/:pid', invalidObjectCidMid, inexistsCidMid, invalidObjectPidMid, inexistsPidInProductCartMid, quantityNegMid, async (req,res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let field = req.body;
        
        let cartUpdt = await mongoCartManager.updateQuantity(cid, pid, field);
        res.status(200).json({status: 'ok', quantityUpdated:cartUpdt});    
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.delete('/:cid/product/:pid', invalidObjectCidMid, inexistsCidMid, invalidObjectPidMid, inexistsPidInProductCartMid, async (req,res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;

        let cartUpdt = await mongoCartManager.deleteProduct(cid, pid);
        res.status(200).json({status: 'ok', cartUpdated:cartUpdt});     
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.delete('/:cid', invalidObjectCidMid, inexistsCidMid, async (req,res) => {
    try {
        let cid = req.params.cid;

        let productsDel = await mongoCartManager.deleteAllProducts(cid);
        res.status(200).json({status: 'ok', cleanProducts:productsDel});  
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})