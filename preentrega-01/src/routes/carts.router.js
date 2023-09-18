const Router = require("express").Router;
const router = Router();

const path = require("path");
const fs = require("fs");

let route = path.join(__dirname, '..', 'files', 'cart.json');

const getCart = () => {
    if(!fs.existsSync(route)) return [];
    
    return JSON.parse(fs.readFileSync(route, 'utf-8'));
}

const save = cart => {
    fs.writeFileSync(route, JSON.stringify(cart, null, '\t'));
}

/*------------------------------*\
    #MIDDLEWARES GET '/:cid'
\*------------------------------*/

const nanMid = (req, res, next) => {
    let cid = parseInt(req.params.cid);
    
    if(isNaN(cid)) return res.status(400).json({status:'error', message:'Requiere un argumento cid de tipo numerico'});

    next();
}

const invalidPidMid = (req, res, next) => {
    let cart = getCart();
    let cid = parseInt(req.params.cid);
    
    let cartSelected = cart.filter(cart => cart.cartId === cid);
    if(cartSelected.length === 0){
        return res.status(400).json({status:'error', message:`El carrito con CID ${cid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/carts/34123123
    }

    next();
}

/*------------------------------------------*\
    #MIDDLEWARES POST '/:cid/product/:pid'
\*------------------------------------------*/

const nanCidPid = (req, res, next) => {
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    
    if(isNaN(cid) || isNaN(pid)) return res.status(400).json({status:'error', message:'Se requieren argumentos cid y pid de tipo numerico'});

    next();
}

const pidInvalid = (req, res, next) => {
    let pid = parseInt(req.params.pid);

    if(pid < 1) return res.status(400).json({status:'error', message:`El PID ${pid} es invalido. Deben ser mayores o iguales a 1`});

    next();
}

const invalidCidMid = (req, res, next) => {
    let cart = getCart();
    let cid = parseInt(req.params.cid);
    
    let idxCart = cart.findIndex(cart => cart.cartId === cid);
    if(idxCart === -1) return res.status(400).json({error:`El carrito con CID ${cid} no existe`});

    next();
}

/*------------------------------*\
        #CART ROUTES
\*------------------------------*/

router.post('/', (req,res) => {
    let cart = getCart();
    
    let carritoId = 1;
    if(cart.length > 0) carritoId = cart[cart.length-1].cartId + 1;

    let newCart = {
        cartId: carritoId, 
        products: [] 
    }
    
    cart.push(newCart);

    save(cart);

    res.status(200).json(newCart);
})

router.get('/:cid', nanMid, invalidPidMid, (req, res) => {
    let cart = getCart();
    let cid = parseInt(req.params.cid);
    
    let cartSelected = cart.filter(cart => cart.cartId === cid);
    return res.status(200).json({status:'ok', cartProducts: cartSelected[0].products});                              // Caso en el que se cumple http://localhost:8080/api/carts/2
})

router.post('/:cid/product/:pid', nanCidPid, pidInvalid, invalidCidMid, (req,res) => {
    let cart = getCart();
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    
    let idxCart = cart.findIndex(cart => cart.cartId === cid);
    let productsSelected = cart[idxCart].products;

    let idxPid = productsSelected.findIndex(prod => prod.productId === pid);
    if(idxPid === -1){
        // El producto no se encuentra definido en esta orden de compra.
        // Se agrega de a una unidad como solicita el enunciado
        let newProductAdded = {
            productId: pid,
            quantity: 1 
        }
        productsSelected.push(newProductAdded);
        cart[idxCart].products = productsSelected; 
    } else {
        // Se aumenta en uno la cantidad del producto como solicita el enunciado
        productsSelected[idxPid].quantity += 1;
    }

    save(cart);

    res.status(200).json({cart});
})

module.exports = router;