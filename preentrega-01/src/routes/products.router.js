const Router = require("express").Router;
const router = Router();

const path = require("path");
const fs = require("fs");

let route = path.join(__dirname, '..', 'files', 'products.json');

const getProducts = () => {
    if(!fs.existsSync(route)) return [];
    
    return JSON.parse(fs.readFileSync(route, 'utf-8'));
}

const save = (products) => {
    fs.writeFileSync(route, JSON.stringify(products, null, '\t'));
}

/*------------------------------*\
        #MIDDLEWARES GET '/'
\*------------------------------*/

const limitInvalidMid = (req, res, next) => {
    let products = getProducts();
    let {limit} = req.query;
    
    
    if(parseInt(limit) < 1 || parseInt(limit) > products.length){
        return res.status(400).send(`Error. LIMIT ${limit} no esta permitido. Por favor, ingrese un LIMIT entre 1 y ${products.length} inclusive`)
    }

    next();
}

const noLimitMid = (req, res, next) => {
    let products = getProducts();

    if(Object.keys(req.query).length === 0){
        // No se pasan query params por URL
        return res.status(200).json({status:'ok', prods:products}); 
    }

    next();
}

/*------------------------------*\
    #MIDDLEWARES GET '/:pid'
\*------------------------------*/

const nanMid = (req, res, next) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({status:'error', message:'Requiere un argumento id de tipo numerico'});

    next();
}

const invalidPidMid = (req, res, next) => {
    let products = getProducts();
    let pid = parseInt(req.params.pid);
    let prodId = products.filter(product => product.id === pid);

    if(prodId.length === 0){
        return res.status(400).json({status:'error', message:`El producto con ID ${pid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/products/34123123
    }

    next();
}

/*------------------------------*\
        #MIDDLEWARES POST '/'
\*------------------------------*/

const emptyFieldMid = (req, res, next) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
    }

    next();
}

const sameCodeMid = (req, res, next) => {
    let {code} = req.body;

    let products = getProducts();
    const productWithSameCode = products.filter((prod) => prod.code === code); 
    
    if(productWithSameCode.length > 0){
        return res.status(400).json({error:'No se permiten agregar productos distintos que tengan el mismo codigo'});
    }

    next();
}

const priceStockNegMid = (req, res, next) => {
    let {price, stock} = req.body;

    if(price <= 0 || stock <= 0){
        return res.status(400).json({error:'Los campos price y stock deben ser positivos.'});
    }

    next();
}

/*------------------------------*\
    #MIDDLEWARES PUT '/:pid'
\*------------------------------*/

const incompleteFieldsMid = (req, res, next) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if(!title && !description && !code && !price && !status && !stock && !category){
        return res.status(400).json({error:'Complete los campos title, description, code, price, status, stock o category que desea modificar en el body'});
    }

    next();
}

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

router.get('/', limitInvalidMid, noLimitMid, (req, res) => {
    let products = getProducts();
    
    // Desestructuracion del query param limit
    let {limit} = req.query;
    let limitedProducts = products.slice(0, parseInt(limit));
    
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({status:'ok', prods:limitedProducts});
})

router.get('/:pid', nanMid, invalidPidMid, (req, res) => {
    let products = getProducts();
    let pid = parseInt(req.params.pid);
    
    let prodId = products.filter(product => product.id === pid);
    return res.status(200).json({status:'ok', dataProduct:prodId});                              // Caso en el que se cumple http://localhost:8080/api/products/2
    
})

router.post('/', emptyFieldMid, sameCodeMid, priceStockNegMid, (req,res) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    let products = getProducts();
    
    let id = 1;
    if(products.length > 0) id = products[products.length-1].id + 1;

    let newProduct = {
        id: id, 
        title: title, 
        description: description, 
        code: code, 
        price: price, 
        status: status, 
        stock: stock, 
        category: category, 
        thumbnails: thumbnails 
    }

    products.push(newProduct);

    save(products);

    res.status(200).json({product: newProduct});
})

router.put('/:pid', nanMid, invalidPidMid, incompleteFieldsMid, sameCodeMid, priceStockNegMid, (req, res) => {
    let pid = parseInt(req.params.pid);
    
    let products = getProducts();
    let idxSelectedProduct = products.findIndex(prod => prod.id === pid);
    
    // El producto existe. Se modifican las propiedades pasadas por el body
    for(const entry of Object.entries(req.body)){
        products[idxSelectedProduct][entry[0]] = entry[1];
    }
    
    save(products);

    res.status(200).json({productoModificado:products[idxSelectedProduct]});
})

router.delete('/:pid', nanMid, invalidPidMid, (req,res) => {
    let pid = parseInt(req.params.pid);
    
    let products = getProducts();
    let idxDeletedProduct = products.findIndex(prod => prod.id === pid);
    
    let deletedProduct = products.splice(idxDeletedProduct, 1);

    save(products);

    res.status(200).json({deletedProduct});
})

module.exports = router;


