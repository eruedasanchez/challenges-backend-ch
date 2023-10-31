import express from 'express';
import cartsController from '../controllers/cartsController.js';
import { invalidObjectCidMid, inexistsCidMid } from '../controllers/cartsController.js';
import { invalidObjectPidMid, inexistsPidMid } from '../controllers/cartsController.js';
import { emptyFieldProductsMid, invalidObjectProductIdMid, negativeQuantityMid } from '../controllers/cartsController.js';
import { inexistsPidInProductCartMid, quantityNegMid } from '../controllers/cartsController.js';

export const router = express.Router();

/*-----------------*\
    #CART ROUTES
\*-----------------*/

router.post('/', cartsController.postCart);

router.get('/:cid', invalidObjectCidMid, inexistsCidMid, cartsController.getCartById);

router.post('/:cid/product/:pid', invalidObjectCidMid, inexistsCidMid, invalidObjectPidMid, inexistsPidMid, cartsController.postProductInCart);

router.put('/:cid', invalidObjectCidMid, inexistsCidMid, emptyFieldProductsMid, invalidObjectProductIdMid, negativeQuantityMid, cartsController.putCart);

router.put('/:cid/product/:pid', invalidObjectCidMid, inexistsCidMid, invalidObjectPidMid, inexistsPidInProductCartMid, quantityNegMid, cartsController.putProdQuantityInCart);

router.delete('/:cid/product/:pid', invalidObjectCidMid, inexistsCidMid, invalidObjectPidMid, inexistsPidInProductCartMid, cartsController.deleteProductInCart);

router.delete('/:cid', invalidObjectCidMid, inexistsCidMid, cartsController.cleanCart);

