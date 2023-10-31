import mongoose from 'mongoose';
import { cartsService } from "../services/carts.service.js";
import { productsService } from '../services/products.service.js';

/*------------------------------*\
    #MIDDLEWARES GET '/:cid'
\*------------------------------*/

export const invalidObjectCidMid = (req, res, next) => {
    let cid = req.params.cid;
    
    if(!mongoose.Types.ObjectId.isValid(cid)) return res.status(400).json({status:'error', error:'El pid ingresado tiene un formato invalido'});

    next();
}

export const inexistsCidMid = async (req, res, next) => {
    let carts = await cartsService.getCarts();
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

export const invalidObjectPidMid = (req, res, next) => {
    let pid = req.params.pid;
    
    if(!mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({status:'error', error:'El PID ingresado tiene un formato invalido'});

    next();
}

export const inexistsPidMid = async (req, res, next) => {
    let products = await productsService.getProducts();
    let pid = req.params.pid;
    
    let productPid = products.filter(product => product._id.equals(new mongoose.Types.ObjectId(pid)));
    
    if(productPid.length === 0){
        return res.status(400).json({status:'error', message:`El producto con PID ${pid} no existe`}); 
    }
    
    next();
}

/*------------------------------------------*\
    #MIDDLEWARES DELETE '/:cid/product/:pid'
\*------------------------------------------*/

export const inexistsPidInProductCartMid = async (req, res, next) => {
    let cid = req.params.cid;
    let pid = req.params.pid;

    let cartSelected = await cartsService.getCartByIdWithoutPopulate(cid);
    let productsSelected = cartSelected[0].products;
    let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));
    
    if(idxPid === -1){
        return res.status(400).json({status:'error', message:`El producto con PID ${pid} no existe en el carrito con CID ${cid}.`});
    }
    
    next();
}

/*------------------------------------------*\
            #MIDDLEWARES PUT '/:cid'
\*------------------------------------------*/

export const emptyFieldProductsMid = async (req, res, next) => {
    let inputProducts = req.body;
    
    const newProducts = inputProducts.products;
    for(const prod of newProducts){
        if(!prod.productId || !prod.quantity){
            return res.status(400).json({status:'error', message:`Cada producto del arreglo products ingresado por el body debe tener obligatoriamente los campos productId y quantity completos.`});
        }
    }
    
    next();
}

export const invalidObjectProductIdMid = (req, res, next) => {
    let inputProducts = req.body;
    
    const newProducts = inputProducts.products;
    for(const prod of newProducts){
        if(!mongoose.Types.ObjectId.isValid(prod.productId)){
            return res.status(400).json({status:'error', error:'Todos los productId ingresados deben ser de tipo ObjectId'});
        }
    }
    next();
}

export const negativeQuantityMid = async (req, res, next) => {
    let inputProducts = req.body;
    
    const newProducts = inputProducts.products;
    for(const prod of newProducts){
        if(prod.quantity < 1){
            return res.status(400).json({status:'error', message:`Solo se admiten cantidades positivas en cada uno de los productos ingresados.`});
        }
    }
    next();
}

export const quantityNegMid = async (req, res, next) => {
    let fields = req.body;
    
    if(fields.quantity < 1){
            return res.status(400).json({status:'error', message:`El campo quantity solo admite cantidades positivas.`});
        }
    
    next();
}

/*---------------------*\
    #CARTS CONTROLLER
\*---------------------*/

async function postCart(req, res) {
    try {
        let cartAdded = await cartsService.createCart();
        return res.status(200).json({status: 'ok', newCart:cartAdded})
    } catch (error) {
        return res.status(500).json({error:'Error inesperado', detalle:error.message})
    }
}

async function getCartById(req, res) {
    try {
        let cid = req.params.cid;
        let cartSelected = await cartsService.getCartById(cid); 
        
        return res.status(201).json({status:'ok', MongoDBCart:cartSelected});                           
    } catch (error) {
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function postProductInCart(req,res) {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        
        let cartSel = await cartsService.addProduct(cid, pid);
        return res.status(200).json({status: 'ok', cartSelected:cartSel});
    } catch (error) {
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function putCart(req,res) {
    try {
        let cid = req.params.cid;
        let prods = req.body;
            
        let updatedProds = await cartsService.updateProducts(cid, prods);
        return res.status(200).json({status: 'ok', updatedProducts: updatedProds}); 
    } catch (error) {
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function putProdQuantityInCart(req,res) {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let field = req.body;
            
        let cartUpdt = await cartsService.updateQuantity(cid, pid, field);
        return res.status(200).json({status: 'ok', quantityUpdated:cartUpdt});    
    } catch (error) {
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function deleteProductInCart(req,res) {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
    
        let cartUpdt = await cartsService.deleteProduct(cid, pid);
        return res.status(200).json({status: 'ok', cartUpdated:cartUpdt});     
    } catch (error) {
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function cleanCart(req, res) {
    try {
        let cid = req.params.cid;
    
        let productsDel = await cartsService.deleteAllProducts(cid);
        return res.status(200).json({status: 'ok', cleanProducts:productsDel});  
    } catch (error) {
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

export default {
    postCart, 
    getCartById, 
    postProductInCart, 
    putCart, 
    putProdQuantityInCart, 
    deleteProductInCart,
    cleanCart
};