import __dirname from '../utils.js';
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import { cartsService } from '../services/carts.service.js';
import { productsService } from '../services/products.service.js';
import { invalidObjectIdMid } from '../dao/cartsMongoDAO.js'; // inexistsCidMid
import { fakerES_MX as faker } from '@faker-js/faker';
import { config } from '../config/config.js';

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

/*------------------------------------------------------------------*\
    #MIDDLEWARES GET '/', '/login', '/signup', /confirmNewPassword
\*------------------------------------------------------------------*/

// Se intenta logearse o registrarse pero ya se encuentra una sesión activa
const activeSessionMid = (req, res, next) => {
    if(req.session.users){
        let {first_name, last_name, email, rol} = req.session.users;
        return res.redirect(`/products?userFirstName=${first_name}&userLastName=${last_name}&userEmail=${email}&userRole=${rol}`);
    } 

    next();
}

const auth = async (req, res, next) => {
    let token = req.query.token;
    try {
        let infoUser = jwt.verify(token, config.SECRET); // Se obtiene la info del usuario
        req.user = infoUser.user;
        next();
    } catch (error) {
        // Token expirado
        return res.redirect('/resetPassword?expiredToken=El link se encuentra vencido. Por favor, envíe nuevamente la solicitud');
    }
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

router.get('/resetPassword', (req,res) => {
    let emptyFieldEmail = false, unregisteredClient = false, successResetPassRequest = false, tokenExpired = false, equalPassword = false ;
    
    let {error, unregisteredEmail, successResetRequest, expiredToken, samePassword} = req.query;
    
    if(error) emptyFieldEmail = error;

    if(unregisteredEmail) unregisteredClient = unregisteredEmail;

    if(successResetRequest) successResetPassRequest = successResetRequest;

    if(expiredToken) tokenExpired = expiredToken;

    if(samePassword) equalPassword = samePassword;
    
    res.status(200).render('resetPassword', {
        emptyFieldEmail,
        unregisteredClient,
        successResetPassRequest,
        tokenExpired,
        equalPassword
    });
})

router.get('/confirmNewPassword', auth, (req,res) => {
    let userEmail = req.user.email;
    
    res.status(200).render('confirmNewPassword', { userEmail });
})

router.get('/login', activeSessionMid, (req,res) => {
    let errorDetail = false, userEmail = false, logoutSuccess = false, newPasswordSuccess = false;

    let {error, createdUser, message, successNewPassword} = req.query;
    
    if(error) errorDetail = error;
    
    if(createdUser) userEmail = createdUser;

    if(message) logoutSuccess = message;

    if(successNewPassword) newPasswordSuccess = successNewPassword;
    
    res.status(200).render('login', {
        errorDetail,
        userEmail, 
        logoutSuccess,
        newPasswordSuccess
    });
})

router.get('/products', passport.authenticate('current', {session:false}), async (req,res) => {
    let profileSuccessfullyLoad = false, productsSuccessfullyLoad = false, documentsSuccessfullyLoad = false, mandatoryDocumentEmpty = false;
    let {limit, page, userId, userFirstName, userLastName, userEmail, userRole, cartId, successProfile, successProducts, successDocuments, unsuccessChangeRole} = req.query;
    
    if(!limit) limit = 10;
    if(!page) page = 1;

    if(successProfile) profileSuccessfullyLoad = successProfile;

    if(successProducts) productsSuccessfullyLoad = successProducts;

    if(successDocuments) documentsSuccessfullyLoad = successDocuments;

    if(unsuccessChangeRole) mandatoryDocumentEmpty = unsuccessChangeRole;
    
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
        userId: userId,
        userFirstName: userFirstName, 
        userLastName: userLastName, 
        userEmail: userEmail, 
        userRole: userRole,
        cartId: cartId,
        profileSuccessfullyLoad: profileSuccessfullyLoad,
        productsSuccessfullyLoad: productsSuccessfullyLoad, 
        documentsSuccessfullyLoad: documentsSuccessfullyLoad,
        mandatoryDocumentEmpty: mandatoryDocumentEmpty
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
        req.logger.fatal(`Error al obtener un carrito determinado. Detalle: ${error.message}`);
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

router.get('/loggerTest', (req, res) => {
    req.logger.log("fatal", "Prueba log - nivel fatal");
    req.logger.log("error", "Prueba log - nivel error");
    req.logger.log("warning", "Prueba log - nivel warning");
    req.logger.log("info", "Prueba log - nivel info");
    req.logger.log("http", "Prueba log - nivel http");
    req.logger.log("debug", "Prueba log - nivel debug");

    res.setHeader('Content-Type','text/html');
    res.status(200).render('loggerTest');
});

// Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce


