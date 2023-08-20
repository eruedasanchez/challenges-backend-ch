const express = require("express");

const products = require("./files/products.json");

const PORT = 8080;

const app = express();

app.get("/", (req, res) => {
    res.send("Bienvenidos al server de Product Manager desarrollado con Express JS")
})

app.get("/products", (req, res) => {
    if(Object.keys(req.query).length === 0){
        // No se pasan query params por URL
        return res.json({status:'ok', prods:products}); 
    }
    
    // Desestructuracion del query param limit
    let {limit} = req.query;
    let limitedProducts = products;
    
    if(parseInt(limit) < 1 || parseInt(limit) > limitedProducts.length){
        return res.send(`Error. LIMIT ${limit} no esta permitido. Por favor, ingrese un LIMIT entre 1 y ${limitedProducts.length} inclusive`)
    } else {
        limitedProducts = limitedProducts.slice(0, parseInt(limit));
        return res.json({status:'ok', limitedProducts});
    }
})

app.get("/products/:pid", (req, res) => {
    let pid = parseInt(req.params.pid);
    
    if(isNaN(pid)){
        res.json({status:'error', message:'Requiere un argumento id de tipo numerico'});
        return;
    }

    let prodId = products.filter(product => product.id === pid);
    if(prodId.length > 0){
        res.json({status:'ok', dataProduct:prodId});                              // Caso en el que se cumple http://localhost:8080/products/2
    } else {
        res.json({status:'error', message:`El producto con ID ${pid} no existe`}); // Caso en el que se cumple http://localhost:8080/products/34123123
    }
})

app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`);
})




