import express from 'express';
import productsController from '../controllers/productsController.js'; 
import { noParamsMid, limitMid, pageMid, queryMid, sortMid, limitPageMid, limitQueryMid, limitSortMid, pageQueryMid, pageSortMid, querySortMid, limitPageQueryMid, limitPageSortMid, limitQuerySortMid, pageQuerySortMid } from '../controllers/productsController.js';
import { invalidObjectIdMid, invalidPidMid } from '../controllers/productsController.js';
import { emptyFieldMid, priceStockNegMid, sameCodeMid, sameDescriptionMid, sameTitleMid, emptyFieldsModifyMid } from '../controllers/productsController.js'; 

export const router = express.Router();

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

router.get('/', noParamsMid, limitMid, pageMid, queryMid, sortMid, limitPageMid, limitQueryMid, limitSortMid, pageQueryMid, pageSortMid, querySortMid, limitPageQueryMid, limitPageSortMid, limitQuerySortMid, pageQuerySortMid, productsController.getProducts);

router.get('/:pid', invalidObjectIdMid, invalidPidMid, productsController.getProductById);

router.post('/', emptyFieldMid, sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, productsController.postProduct);

router.put('/:pid', invalidObjectIdMid, invalidPidMid, emptyFieldsModifyMid, sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, productsController.putProduct);

router.delete('/:pid', invalidObjectIdMid, invalidPidMid, productsController.deleteProduct);

router.delete('/:pid', invalidObjectIdMid, invalidPidMid, productsController.deleteProduct);