import express from 'express';
import cartsController from '../controllers/cartsController.js';
// import { inexistsCidMid } from '../controllers/cartsController.js'; //invalidObjectCidMid
// import { invalidObjectPidMid } from '../controllers/cartsController.js'; // , inexistsPidMid
// import { emptyFieldProductsMid, invalidObjectProductIdMid, negativeQuantityMid } from '../controllers/cartsController.js';
// import { inexistsPidInProductCartMid, quantityNegMid } from '../controllers/cartsController.js';

export const router = express.Router();

/*-----------------*\
    #CART ROUTES
\*-----------------*/

router.post('/', cartsController.postCart); // ok

router.get('/:cid', cartsController.getCartById); // ok

router.post('/:cid/product/:pid', cartsController.postProductInCart); // ok

// , invalidObjectCidMid y , emptyFieldProductsMid y, invalidObjectProductIdMid y, negativeQuantityMid y
router.put('/:cid', cartsController.putCart); // ok

// , invalidObjectCidMid ym yfs , invalidObjectPidMid ym yfs, inexistsPidInProductCartMid ym yfs, quantityNegMid ym yfs
router.put('/:cid/product/:pid', cartsController.putProdQuantityInCart); // ok

// , invalidObjectCidMid ym yfs, invalidObjectPidMid ym yfs, inexistsPidInProductCartMid ym yfs
router.delete('/:cid/product/:pid', cartsController.deleteProductInCart); // ok

// invalidObjectCidMid ym yfs,
router.delete('/:cid', cartsController.cleanCart); // ok




