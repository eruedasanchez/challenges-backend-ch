import __dirname from '../utils.js';
import express from 'express';
import mongoose from 'mongoose';
import MongoProductManager from '../dao/mongoDB-manager/MongoProductManager.js';
import MongoCartManager from '../dao/mongoDB-manager/MongoCartManager.js';

export const router = express.Router();

const mongoProductManager = new MongoProductManager();
const mongoCartManager = new MongoCartManager();

/*------------------------------*\
    #MIDDLEWARES GET '/:cid'
\*------------------------------*/

const invalidObjectCidMid = (req, res, next) => {
    let cid = req.params.cid;
    
    if(!mongoose.Types.ObjectId.isValid(cid)) return res.status(400).json({status:'error', error:'El pid ingresado tiene un formato invalido'});

    next();
}

const inexistsCidMid = async (req, res, next) => {
    let carts = await mongoCartManager.getCarts();
    let cid = req.params.cid;
    
    let cartCid = carts.filter(cart => cart._id.equals(new mongoose.Types.ObjectId(cid)));
    
    if(cartCid.length === 0){
        return res.status(400).json({status:'error', message:`El carrito con CID ${cid} no existe`}); 
    }

    next();
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

/*------------------------------*\
        #VIEWS ROUTES
\*------------------------------*/

router.get('/', activeSessionMid, (req,res) => {
    res.status(200).render('login');
})

router.get('/signup', activeSessionMid, (req,res) => {
    let errorDetail = '';
    
    if(req.query.error) errorDetail = req.query.error;
    
    res.status(200).render('signUp', {errorDetail});
})

router.get('/login', activeSessionMid, (req,res) => {
    let errorDetail = '', userEmail = '', logoutSuccess = '';

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

router.get('/products', async (req,res) => {
    let {limit, page, userFirstName, userLastName, userEmail, userAge, userRole} = req.query;
    
    if(!limit) limit = 10;
    if(!page) page = 1;

    const products = await mongoProductManager.getProductsPaginate(limit, page);

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
        userAge: userAge, 
        userRole: userRole
        // podria pensar en pasarle tambien para que se muestren los datos del usuario
        // req.session.users (ver linea 62 en sesions.router.js)  
    });
});

router.get('/carts/:cid', invalidObjectCidMid, inexistsCidMid, async (req, res) => {
    try {
        let cid = req.params.cid;
        let cartSelected = await mongoCartManager.getCartByIdLean(cid); 
        
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


