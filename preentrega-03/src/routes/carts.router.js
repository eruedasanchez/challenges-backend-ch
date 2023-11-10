import express from 'express';
import cartsController from '../controllers/cartsController.js';

export const router = express.Router();

/*-----------------*\
    #CART ROUTES
\*-----------------*/

router.post('/', cartsController.postCart); 

router.get('/:cid', cartsController.getCartById); 

router.post('/:cid/product/:pid', cartsController.postProductInCart); 

router.put('/:cid', cartsController.putCart); 

router.put('/:cid/product/:pid', cartsController.putProdQuantityInCart); 

router.delete('/:cid/product/:pid', cartsController.deleteProductInCart); 

router.delete('/:cid', cartsController.cleanCart); 

