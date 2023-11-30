import express from 'express';
import passport from 'passport';
import cartsController from '../controllers/cartsController.js';
import { authorization } from './sessions.router.js';

export const router = express.Router();

/*-----------------*\
    #CART ROUTES
\*-----------------*/

router.post('/', cartsController.postCart); 

router.get('/:cid', cartsController.getCartById); 

router.post('/:cid/product/:pid', passport.authenticate('current', {session:false}), authorization('user'), cartsController.postProductInCart); 

router.post('/:cid/purchase', cartsController.confirmPurchase); 

router.put('/:cid', cartsController.putCart); 

router.put('/:cid/product/:pid', cartsController.putProdQuantityInCart); 

router.delete('/:cid/product/:pid', cartsController.deleteProductInCart); 

router.delete('/:cid', cartsController.cleanCart); 

