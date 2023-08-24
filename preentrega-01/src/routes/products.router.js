const Router = require("express").Router;
const router = Router();

const path = require("path");
const fs = require("fs");

let route = path.join(__dirname, '..', 'files', 'products.json');

const getProducts = () => {
    if(!fs.existsSync(route)) return [];
    
    return JSON.parse(fs.readFileSync(route, 'utf-8'));
}

const saveProducts = (products) => {
    fs.writeFileSync(route, JSON.stringify(products, null, '\t'));
}

router.get('/', (req, res) => {
    let products = getProducts();
    
    if(Object.keys(req.query).length === 0){
        // No se pasan query params por URL
        return res.status(200).json({status:'ok', prods:products}); 
    }
    
    // Desestructuracion del query param limit
    let {limit} = req.query;
    let limitedProducts = products;
    
    if(parseInt(limit) < 1 || parseInt(limit) > limitedProducts.length){
        return res.status(400).send(`Error. LIMIT ${limit} no esta permitido. Por favor, ingrese un LIMIT entre 1 y ${limitedProducts.length} inclusive`)
    } else {
        limitedProducts = limitedProducts.slice(0, parseInt(limit));
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({status:'ok', prods:limitedProducts});
    }
})

router.get('/:pid', (req, res) => {
    let products = getProducts();
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({status:'error', message:'Requiere un argumento id de tipo numerico'});
    
    let prodId = products.filter(product => product.id === pid);
    if(prodId.length > 0){
        return res.status(200).json({status:'ok', dataProduct:prodId});                              // Caso en el que se cumple http://localhost:8080/api/products/2
    } else {
        return res.status(400).json({status:'error', message:`El producto con ID ${pid} no existe`}); // Caso en el que se cumple http://localhost:8080/api/products/34123123
    }
})

router.post('/',(req,res)=>{
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if(!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
    }

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

    saveProducts(products);

    res.status(200).json({product: newProduct});
})

router.put('/:pid', (req, res) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({error:'El pid debe ser numerico'});
    
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if(!title && !description && !code && !price && !status && !stock && !category){
        return res.status(400).json({error:'Complete los campos title, description, code, price, status, stock o category que desea modificar en el body'});
    }
    
    let products = getProducts();
    let idxSelectedProduct = products.findIndex(prod => prod.id === pid);

    if(idxSelectedProduct === -1) return res.status(400).json({error:`El producto con ID ${id} no existe`});
    
    // El producto si existe. Se modifican las propiedades pasadas por el body
    for(const entry of Object.entries(req.body)){
        products[idxSelectedProduct][entry[0]] = entry[1];
    }
    
    saveProducts(products);

    res.status(200).json({productoModificado:products[idxSelectedProduct]});
})

router.delete('/:pid', (req,res) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)) return res.status(400).json({error:'El pid debe ser numerico'});
    
    let products = getProducts();
    let idxDeletedProduct = products.findIndex(prod => prod.id === pid);

    if(idxDeletedProduct === -1) return res.status(400).json({error:`El producto con ID ${id} no existe`});
    

    let deletedProduct = products.splice(idxDeletedProduct, 1);

    saveProducts(products);

    res.status(200).json({deletedProduct});
})

module.exports = router;


