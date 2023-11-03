import { cartsService } from "../services/carts.service.js";

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
        let inputProducts = req.body;
        
        let newProducts = inputProducts.products;
        for(const prod of newProducts){
            if(!prod.productId || !prod.quantity){
                // emptyFieldProductsMid
                return res.status(400).json({status:'error', message:`Cada producto del arreglo products ingresado por el body debe tener obligatoriamente los campos productId y quantity completos.`});
            }
            
            if(prod.quantity < 1){
                // negativeQuantityMid
                return res.status(400).json({status:'error', message:`Solo se admiten cantidades positivas en cada uno de los productos ingresados.`});
            }
        }
        
        let updatedProds = await cartsService.updateProducts(cid, inputProducts);
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

        if(field.quantity < 1){
            // quantityNegMid
            return res.status(400).json({status:'error', message:`El campo quantity solo admite cantidades positivas.`});
        }
        
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