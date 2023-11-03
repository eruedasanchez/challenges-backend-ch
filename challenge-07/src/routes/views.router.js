import __dirname from '../utils.js';
import express from 'express';
import passport from 'passport';
import { cartsService } from '../services/carts.service.js';
import { productsService } from '../services/products.service.js';
// import { invalidObjectCidMid } from '../controllers/cartsController.js'; // inexistsCidMid
import { invalidObjectCidMid } from '../dao/cartsMongoDAO.js';

export const router = express.Router();

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
router.get('/carts/:cid', invalidObjectCidMid, async (req, res) => {
    try {
        let cid = req.params.cid;
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


