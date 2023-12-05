import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { ticketsService } from "../services/tickets.service.js";
import { v4 as uuidv4 } from 'uuid';
import { userRole } from "../utils.js";

/*---------------------*\
    #CARTS CONTROLLER
\*---------------------*/

async function postCart(req, res) {
    try {
        let cartAdded = await cartsService.createCart();
        return res.status(200).json({status: 'ok', newCart:cartAdded})
    } catch (error) {
        req.logger.fatal(`Error al crear un carrito. Detalle: ${error.message}`);
        return res.status(500).json({error:'Unexpected', detalle:error.message})
    }
}

async function getCartById(req, res) {
    try {
        let cid = req.params.cid;
        let cartSelected = await cartsService.getCartById(cid); 
        
        return res.status(201).json({status:'ok', MongoDBCart:cartSelected});                           
    } catch (error) {
        req.logger.fatal(`Error al obtener un carrito determinado. Detalle: ${error.message}`);
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function confirmPurchase(req, res) {
    try {
        let { cid } = req.params, {userEmail}  = req.query;
        let cartUpdt, updateProd, updatedStock, productsWithoutStock = [], cartAmount = 0;

        // Purchasing process
        let cartSelected = await cartsService.getCartById(cid);
        let productsSelected = cartSelected[0].products;

        for(const product of productsSelected){
            if(product.productId.stock >= product.quantity){
                // hay suficiente stock del producto 
                cartUpdt = await cartsService.deleteProduct(cid, product.productId._id); // se elimina al producto del carrito
                
                updatedStock = { stock: product.productId.stock - product.quantity };
                updateProd = await productsService.updateProduct(product.productId._id, updatedStock); // se actualiza el stock del producto
                
                cartAmount += product.productId.price * product.quantity;  
            } else {
                productsWithoutStock.push(product.productId._id); // se agregan los id's de los productos que no se pudieron comprar
            }
        }
        
        // Ticket generation process
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
    } catch (error) {
        req.logger.fatal(`Error al confirmar la compra. Detalle: ${error.message}`);
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function postProductInCart(req,res) {
    try {
        let {cid, pid} = req.params, infoUserLoggedIn = req.user;
        
        let productSelected = await productsService.getProductById(pid);
        
        if(infoUserLoggedIn.role === userRole.PREMIUM && infoUserLoggedIn.email === productSelected[0].owner){
            throw new Error('No puede agregar a su carrito un producto que le pertenece');
        }
        
        // Usuario no premium o un usuario premium agrega producto que no le pertenece
        let cartSel = await cartsService.addProduct(cid, pid);
        return res.status(200).json({status: 'ok', cartSelected:cartSel});
    } catch (error) {
        req.logger.fatal(`Error al agregar un producto al carrito. Detalle: ${error.message}`);
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
        req.logger.fatal(`Error al modificar un carrito determinado. Detalle: ${error.message}`);
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
        req.logger.fatal(`Error al modificar un producto en un carrito determinado. Detalle: ${error.message}`);
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
        req.logger.fatal(`Error al eliminar un producto en un carrito determinado. Detalle: ${error.message}`);
        return res.status(500).json({error:'Unexpected error', detail:error.message});
    }
}

async function cleanCart(req, res) {
    try {
        let cid = req.params.cid;
    
        let productsDel = await cartsService.deleteAllProducts(cid);
        return res.status(200).json({status: 'ok', cleanProducts:productsDel});  
    } catch (error) {
        req.logger.fatal(`Error al eliminar todos los productos en un carrito determinado. Detalle: ${error.message}`);
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