const Router = require("express").Router;
const router = Router();

const path = require("path");
const fs = require("fs");

let route = path.join(__dirname, '..', 'files', 'cart.json');

const getCart = () => {
    if(!fs.existsSync(route)) return [];
    
    return JSON.parse(fs.readFileSync(route, 'utf-8'));
}

const saveCart = cart => {
    fs.writeFileSync(route, JSON.stringify(cart, null, '\t'));
}

router.post('/', (req,res) => {
    let { products } = req.body;

    if(!products){
        return res.status(400).json({error:'El campo products es obligatorio!'});
    }

    let cart = getCart();
    
    let cartId = 1;
    if(cart.length > 0) cartId = cart[cart.length-1].orderId + 1;

    let newOrder = {
        orderId: cartId, 
        products: products 
    }

    for(const prod of products){
        // Se chequea que por el body se pase el formato pedido para cada producto
        if(!(Object.keys(prod).includes("productId") && Object.keys(prod).includes("quantity") && Object.keys(prod).length === 2)){
            return res.status(400).json({error:'Se debe pasar el siguiente formato por el body: {"products":[{"productId":number, "quantity":number}]}'});
        }  
    }
    
    cart.push(newOrder);

    saveCart(cart);

    res.status(200).json(newOrder);
})

router.get('/:cid', (req, res) => {
    let cart = getCart();
    let cid = parseInt(req.params.cid);
    
    if(isNaN(cid)) return res.status(400).json({status:'error', message:'Requiere un argumento cid de tipo numerico'});
    
    let orderSelected = cart.filter(order => order.orderId === cid);
    if(orderSelected.length > 0){
        return res.status(200).json({status:'ok', orderDetails: orderSelected[0].products});                              // Caso en el que se cumple http://localhost:8080/api/carts/2
    } else {
        return res.status(400).json({status:'error', message:`La orden con CID ${cid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/carts/34123123
    }
})

router.post('/:cid/product/:pid', (req,res) => {
    let cart = getCart();
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    
    if(isNaN(cid) || isNaN(pid)) return res.status(400).json({status:'error', message:'Se requieren argumentos cid y pid de tipo numerico'});

    if(pid < 1) return res.status(400).json({status:'error', message:`El PID ${pid} es invalido. Deben ser mayores o iguales a 1`});
    
    let idxOrder = cart.findIndex(order => order.orderId === cid);
    if(idxOrder === -1) return res.status(400).json({error:`La orden con CID ${cid} no existe`});

    let orderProducts = cart[idxOrder].products;

    let idxPid = orderProducts.findIndex(prod => prod.productId === pid);
    if(idxPid === -1){
        // El producto no se encuentra definido en esta orden de compra.
        // Se agrega de a una unidad como solicita el enunciado
        let newProductAdded = {
            productId: pid,
            quantity: 1 
        }
        orderProducts.push(newProductAdded);
        cart[idxOrder].products = orderProducts; 
    } else {
        // Se aumenta en uno la cantidad del producto como solicita el enunciado
        orderProducts[idxPid].quantity += 1;
    }

    saveCart(cart);

    res.status(200).json({cart});
})

module.exports = router;