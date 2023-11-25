import __dirname from '../utils.js';
import express from 'express';
import passport from 'passport';
import { cartsService } from '../services/carts.service.js';
import { productsService } from '../services/products.service.js';
import { invalidObjectIdMid } from '../dao/cartsMongoDAO.js'; // inexistsCidMid
import { fakerES_MX as faker } from '@faker-js/faker';

export const router = express.Router();

/*----------------------*\
    #MOCKING FUNCTIONS
\*----------------------*/

const generateThumbnailsArr = idx => {
    let thumbnail, thumbnails = [];

    for(let i=0; i < 3; i++){
        thumbnail = `thumbnail-p${idx+1}-${i+1}`;
        thumbnails.push(thumbnail);
    }
    
    return thumbnails;
}

const generateMockProduct = idx => {
    let _id = faker.string.alphanumeric({length: 24});
    let title = faker.commerce.productName();
    let description = faker.commerce.productDescription();
    let code = faker.string.alphanumeric({length: 8});
    let price = faker.commerce.price({min: 100, max: 10000, dec: 0, symbol: '$' });
    let stock = faker.number.int({ min: 0, max: 100});
    let status = stock > 0 ? true : false;
    let category = faker.commerce.product();
    let thumbnails = generateThumbnailsArr(idx);

    let mockProduct = {
        _id,
        title,
        description,
        code,
        price,
        status,
        stock, 
        category,
        thumbnails
    };

    return mockProduct;
}

/*----------------------------------------------*\
    #MIDDLEWARES GET '/', '/login', '/signup'
\*----------------------------------------------*/

// Se intenta logearse o registrarse pero ya se encuentra una sesión activa
const activeSessionMid = (req, res, next) => {
    if(req.session.users){
        let {first_name, last_name, email, rol} = req.session.users;
        return res.redirect(`/products?userFirstName=${first_name}&userLastName=${last_name}&userEmail=${email}&userRole=${rol}`);
    } 

    next();
}

/*-----------------*\
    #VIEWS ROUTES
\*-----------------*/

router.get('/', activeSessionMid, (req,res) => {
    res.status(200).render('login');
})

router.get('/signup', activeSessionMid, (req,res) => {
    let errorDetail = false;
    
    if(req.query.error) errorDetail = req.query.error;
    
    res.status(200).render('signUp', {errorDetail});
})

router.get('/login', activeSessionMid, (req,res) => {
    let errorDetail = false, userEmail = false, logoutSuccess = false;

    let {error, createdUser, message} = req.query;
    
    if(error) errorDetail = error;
    
    if(createdUser) userEmail = createdUser;

    if(message) logoutSuccess = message;
    
    res.status(200).render('login', {
        errorDetail,
        userEmail, 
        logoutSuccess
    });
})

router.get('/products', passport.authenticate('current', {session:false}), async (req,res) => {
    let {limit, page, userFirstName, userLastName, userEmail, userRole, cartId} = req.query;
    
    if(!limit) limit = 10;
    if(!page) page = 1;

    const products = await productsService.getProductsPaginate(limit, page);

    let {totalPages, hasPrevPage, hasNextPage, prevPage, nextPage} = products;
    
    res.setHeader('Content-Type','text/html');
    res.status(200).render('products', {
        header: 'MongoDB Products',
        products: products.docs,
        totalPages: totalPages, 
        hasPrevPage: hasPrevPage, 
        hasNextPage: hasNextPage , 
        prevPage: prevPage, 
        nextPage: nextPage,
        userFirstName: userFirstName, 
        userLastName: userLastName, 
        userEmail: userEmail, 
        userRole: userRole,
        cartId: cartId
    });
});

// inexistsCidMid
router.get('/carts/:cid', async (req, res) => {
    try {
        let cid = req.params.cid;
        invalidObjectIdMid(cid);
        
        let cartSelected = await cartsService.getCartByIdLean(cid); 
        
        res.setHeader('Content-Type','text/html');
        res.status(200).render('cartid', {
            header: 'MongoDB CartId',
            cartId: cartSelected._id,
            cartIdProducts: cartSelected.products,
        });
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.get('/realtimeproducts', (req, res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realTimeProducts');
});

router.get('/mockingproducts', async (req,res) => {
    let product, mockingProducts = [];

    for(let mp = 0; mp < 100; mp++){
        product = generateMockProduct(mp);
        mockingProducts.push(product); 
    }
    
    res.setHeader('Content-Type','text/html');
    res.status(200).render('mockingProducts', {
        header: 'Mocking Products',
        mockingProducts: mockingProducts,
    });
});

