import { cartsService } from "../services/carts.service.js";
import { ticketsService } from "../services/tickets.service.js";
import { v4 as uuidv4 } from 'uuid';

// const myUuid = uuidv4();
// console.log(myUuid);
// En

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

async function confirmPurchase(req, res) {
    try {
        let { cid } = req.params;
        let {userEmail}  = req.query;
        
        // Proceso de compra
        let productsWithoutStock = [];
        let cartAmount = 0;
        let cartSelected = await cartsService.getCartById(cid);
        let productsSelected = cartSelected[0].products;

        productsSelected.forEach(product => {
            if(product.productId.stock >= product.quantity){
                // hay stock (se puede comprar)
                let cartUpdt = cartsService.deleteProduct(cid, product.productId._id); // lo borro al producto del carrito
                product.productId.stock = product.productId.stock - product.quantity;
                cartAmount += product.productId.price;  
            } else {
                productsWithoutStock.push(product.productId._id);
            }
            // console.log("carrito acutalizado", product.productId.stock);
        })

        // Generacion del ticket
        let ticket = {
            code: uuidv4().toString().split('-').join(''),
            purchase_datetime: new Date(),
            amount: cartAmount,
            purchaser: userEmail
        }

        let purchaseTicket = await ticketsService.generateTicket(ticket);
        
        return res.status(201).json({
            status: productsWithoutStock.length > 0 ? 'incomplete' : 'success',
            purchaseTicket: purchaseTicket,
            idsProductsWithoutStock: productsWithoutStock
        });       
        // return res.status(201).json({status:'ok'});                             
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
    confirmPurchase, 
    postProductInCart, 
    putCart, 
    putProdQuantityInCart, 
    deleteProductInCart,
    cleanCart
};