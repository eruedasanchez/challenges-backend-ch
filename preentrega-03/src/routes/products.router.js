import express from 'express';
import productsController from '../controllers/productsController.js'; 
import { noParamsMid, limitMid, pageMid, queryMid, sortMid, limitPageMid, limitQueryMid, limitSortMid, pageQueryMid, pageSortMid, querySortMid, limitPageQueryMid, limitPageSortMid, limitQuerySortMid, pageQuerySortMid } from '../controllers/productsController.js';
import { priceStockNegMid, sameCodeMid, sameDescriptionMid, sameTitleMid } from '../controllers/productsController.js'; 
export const router = express.Router();

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

router.get('/', noParamsMid, limitMid, pageMid, queryMid, sortMid, limitPageMid, limitQueryMid, limitSortMid, pageQueryMid, pageSortMid, querySortMid, limitPageQueryMid, limitPageSortMid, limitQuerySortMid, pageQuerySortMid, productsController.getProducts);

router.get('/:pid', productsController.getProductById); 

router.post('/', sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, productsController.postProduct); 

router.put('/:pid', sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, productsController.putProduct); 

router.delete('/:pid', productsController.deleteProduct); 
