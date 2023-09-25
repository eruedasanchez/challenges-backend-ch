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

// const route = path.join(__dirname, 'data', 'products.json');
// const productManager = new ProductManager(route);

// const save = (products) => {
//     fs.writeFileSync(route, JSON.stringify(products, null, '\t'));
// }

/*------------------------------*\
        #MIDDLEWARES POST '/'
\*------------------------------*/

// const emptyFieldMid = (req, res, next) => {
//     let {title, description, code, price, status, stock, category, thumbnails} = req.body;

//     if(!title || !description || !code || !price || !status || !stock || !category){
//         return res.status(400).json({error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
//     }

//     next();
// }

// const sameCodeMid = (req, res, next) => {
//     let {code} = req.body;

//     let products = productManager.getProducts();
//     const productWithSameCode = products.filter((prod) => prod.code === code); 
    
//     if(productWithSameCode.length > 0){
//         return res.status(400).json({error:'No se permiten agregar productos distintos que tengan el mismo codigo'});
//     }

//     next();
// }

// const priceStockNegMid = (req, res, next) => {
//     let {price, stock} = req.body;

//     if(price <= 0 || stock <= 0){
//         return res.status(400).json({error:'Los campos price y stock deben ser positivos.'});
//     }

//     next();
// }

/*-----------------------------------*\
    #MIDDLEWARES DELETE '/:pid'
\*-----------------------------------*/

// const nanMid = (req, res, next) => {
//     let pid = parseInt(req.params.pid);
    
//     if(isNaN(pid)) return res.status(400).json({status:'error', message:'Requiere un argumento id de tipo numerico'});

//     next();
// }

// const invalidPidMid = (req, res, next) => {
//     let products = productManager.getProducts();
//     let pid = parseInt(req.params.pid);
//     let prodId = products.filter(product => product.id === pid);

//     if(prodId.length === 0){
//         return res.status(400).json({status:'error', message:`El producto con ID ${pid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/products/34123123
//     }

//     next();
// }



// router.get('/', (req, res) => {
//     res.setHeader('Content-Type','text/html');
//     res.status(200).render('realTimeProducts');
// });

// Creacion de un nuevo producto
// router.post('/', emptyFieldMid, sameCodeMid, priceStockNegMid, (req, res) => {
//     let {title, description, code, price, status, stock, category, thumbnails} = req.body;

//     let products = productManager.getProducts();
    
//     let id = 1;
//     if(products.length > 0) id = products[products.length-1].id + 1;

//     let newProduct = {
//         id: id, 
//         title: title, 
//         description: description, 
//         code: code, 
//         price: price, 
//         status: status, 
//         stock: stock, 
//         category: category, 
//         thumbnails: thumbnails 
//     }

//     products.push(newProduct);

//     save(products);

//     serverSocket.emit('newProduct', newProduct, products);

//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).json({product: newProduct});
// })

// Eliminacion de un producto
// router.delete('/:pid', nanMid, invalidPidMid, (req,res) => {
//     let pid = parseInt(req.params.pid);
    
//     let products = productManager.getProducts();
//     let idxDeletedProduct = products.findIndex(prod => prod.id === pid);
    
//     let deletedProduct = products.splice(idxDeletedProduct, 1);

//     save(products);

//     serverSocket.emit('deletedProduct', deletedProduct, products);

//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).json({deletedProduct});
// })



