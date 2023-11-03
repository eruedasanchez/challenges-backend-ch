import express from 'express';
import productsController from '../controllers/productsController.js'; 
import { noParamsMid, limitMid, pageMid, queryMid, sortMid, limitPageMid, limitQueryMid, limitSortMid, pageQueryMid, pageSortMid, querySortMid, limitPageQueryMid, limitPageSortMid, limitQuerySortMid, pageQuerySortMid } from '../controllers/productsController.js';
// import { invalidPidMid } from '../controllers/productsController.js'; // invalidObjectIdMid,
import { emptyFieldMid, priceStockNegMid, sameCodeMid, sameDescriptionMid, sameTitleMid } from '../controllers/productsController.js'; 
// , emptyFieldsModifyMid
export const router = express.Router();

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

router.get('/', noParamsMid, limitMid, pageMid, queryMid, sortMid, limitPageMid, limitQueryMid, limitSortMid, pageQueryMid, pageSortMid, querySortMid, limitPageQueryMid, limitPageSortMid, limitQuerySortMid, pageQuerySortMid, productsController.getProducts);

// invalidObjectIdMid, invalidPidMid
router.get('/:pid', productsController.getProductById);

// emptyFieldMid, sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid
router.post('/', emptyFieldMid, productsController.postProduct);

// emptyFieldsModifyMid, invalidObjectIdMid, invalidPidMid
router.put('/:pid', sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, productsController.putProduct);

router.delete('/:pid', productsController.deleteProduct);
