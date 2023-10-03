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

/*------------------------------*\
        #VIEWS ROUTES
\*------------------------------*/

// middle para cuando queremos ingresar al peerfil
const auth = (req, res, next) => {
    if(req.session.user){
        // ya se encuentra el usario con la sesion activa
        next()
    } else {
        return res.redirect('/login');
    }
}

// middle para cuando queremos logearnos pero ya estamos logeados (seesion activa)
const authdos = (req, res, next) => {
    if(req.session.user){
        return res.redirect('/profile');
    } else {
        next();
    }
}

router.get('/', (req,res) => {
    res.status(200).render('login');
})

router.get('/signup', authdos, (req,res) => {
    res.status(200).render('signUp');
})

// router.get('/login', authdos, (req,res) => {
//     res.status(200).render('login');
// })

router.get('/profile', auth, (req,res) => {
    res.status(200).render('profile');
})

router.get('/products', async (req,res) => {
    let {limit, page} = req.query;
    
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
        nextPage: nextPage 
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


