import express from 'express';
import mongoose from 'mongoose';
import MongoProductManager from '../dao/mongoDB-manager/MongoProductManager.js';
export const router = express.Router();

const ASC = "asc";
const DESC = "desc";
const mongoProductManager = new MongoProductManager();

/*------------------------------*\
    #MIDDLEWARES FUNCTIONS
\*------------------------------*/

const filterByCategory = (products, query) => {
    let filteredProducts;
    
    if(isNaN(query)){
        filteredProducts = products.filter(prod => prod.category === query); // se filtra por categoria 
    } else {
        filteredProducts = products.filter(prod => prod.stock >= query); // se filtra por disponibilidad (stock disponible)
    }

    return filteredProducts;
}

const sortProducts = (products, order) => {
    let productsSorted = products.sort((prod1, prod2) => prod1.price - prod2.price);                  // ordenamiento por precio creciente por default
    
    if(order === DESC) productsSorted = products.sort((prod1, prod2) => prod2.price - prod1.price);

    return productsSorted;
}

const formatResults = (productsData, prodsRes)  => {
    return {
        status: 'success',
        payload: prodsRes,
        totalPages: productsData.totalPages, 
        prevPage: productsData.prevPage, 
        nextPage: productsData.nextPage,
        page: productsData.page,
        hasPrevPage: productsData.hasPrevPage, 
        hasNextPage: productsData.hasNextPage,
        prevLink: productsData.hasPrevPage ? `http://localhost:8080/products?page=${productsData.prevPage}` : null,
        nextLink: productsData.hasNextPage ? `http://localhost:8080/products?page=${productsData.nextPage}` : null   
    }
}

/*------------------------------*\
        #MIDDLEWARES GET '/'
\*------------------------------*/

// 1. No se pasa ningun param --> Retorna los primeros 10 productos de la pagina 1 
const noParamsMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && !page && !query && !sort){
        let productsData = await mongoProductManager.getProductsPaginate(10, 1);
        let products = formatResults(productsData, productsData.docs);
        
        return res.status(201).json({MongoDBProducts:products});  
    }
    
    next();
}

// 2. Solo se pasa por param limit --> Retorna los primeros "limit" productos de la pagina 1 
const limitMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(limit && !page && !query && !sort){
        if(isNaN(limit)) return res.status(400).json({status:'error', message:'El parametro LIMIT es de tipo numerico'});

        let productsData = await mongoProductManager.getProductsPaginate(limit, 1);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }
        
        let products = formatResults(productsData, productsData.docs);
        return res.status(201).json({MongoDBProductsLimited:products});  
    }
    
    next();
}

// 3. Solo se pasa page por param --> Retorna los primeros 10 productos de la pagina "page"
const pageMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && page && !query && !sort){
        if(isNaN(page)) return res.status(400).json({status:'error', message:'El parametro PAGE es de tipo numerico'});

        let productsData = await mongoProductManager.getProductsPaginate(10, page);
        
        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }
        
        let products = formatResults(productsData, productsData.docs);
        return res.status(201).json({MongoDBProductsRequestedPage:products});  
    }
    
    next();
}

// 4. Solo se pasa query por param --> Retorna de los primeros 10 productos de la pagina 1 aquellos que satisfacen el filtro ingresado por "query" (categoria o stock/disponibilidad)
const queryMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && !page && query && !sort){
        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});
        
        let productsData = await mongoProductManager.getProductsPaginate(10, 1);
        let filteredProducts = filterByCategory(productsData.docs, query);
        let products = formatResults(productsData, filteredProducts);
        
        return res.status(201).json({MongoDBProductsRequested:products});  
    }
    
    next();
}

// 5. Solo se pasa sort por param --> Ordena los primeros 10 productos de la pagina 1 segun el precio (Ascendente o Descendente)
const sortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && !page && !query && sort){
        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }
        
        let productsData = await mongoProductManager.getProductsPaginate(10, 1);
        let productsSorted = sortProducts(productsData.docs, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}

// 6. Combinacion limit y query --> Filtra los productos de la pagina 1 segun la categoria indicada en query y retorna los primeros "limit" productos 
const limitQueryMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(limit && !page && query && !sort){
        if(isNaN(limit)) return res.status(400).json({status:'error', message:'El parametro LIMIT es de tipo numerico'});

        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});
        
        let productsData = await mongoProductManager.getProductsPaginate(limit, 1);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }

        let filteredProducts = filterByCategory(productsData.docs, query);
        let products = formatResults(productsData, filteredProducts);
        
        return res.status(201).json({MongoDBProductsRequested:products}); 
    }
    
    next();
}

// 7. Combinacion limit y page --> Devuelve los productos de la pagina "page" y retorna los primeros "limit" productos
const limitPageMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(limit && page && !query && !sort){
        if(isNaN(limit) || isNaN(page)){
            return res.status(400).json({status:'error', message:'Los parametros LIMIT y PAGE son de tipo numerico'});
        }

        let productsData = await mongoProductManager.getProductsPaginate(limit, page);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }

        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }

        let products = formatResults(productsData, productsData.docs);
        return res.status(201).json({MongoDBProdsLimitPage:products});
    }
    
    next();
}

// 8. Combinacion limit y sort --> Limita los primeros "limit" productos de la pagina 1 y los ordena segun el criterio "sort" pasado por param
const limitSortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(limit && !page && !query && sort){
        if(isNaN(limit)){
            return res.status(400).json({status:'error', message:'El parametro LIMIT es de tipo numerico'});
        }

        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }
        
        let productsData = await mongoProductManager.getProductsPaginate(limit, 1);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }
        
        let productsSorted = sortProducts(productsData.docs, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}

// 9. Combinacion limit, page y query --> Limita los primeros "limit" productos de la pagina "page" y filtra aquellos que satisfacen la categoria pasada por param
const limitPageQueryMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(limit && page && query && !sort){
        if(isNaN(limit)) return res.status(400).json({status:'error', message:'El parametro LIMIT es de tipo numerico'});

        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});
        
        let productsData = await mongoProductManager.getProductsPaginate(limit, page);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }

        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }

        let filteredProducts = filterByCategory(productsData.docs, query);
        let products = formatResults(productsData, filteredProducts);
        
        return res.status(201).json({MongoDBProdsLimitPage:products});
    }
    
    next();
}

// 10. Combinacion limit, page y sort --> Limita los primeros "limit" productos de la pagina "page" y los ordena segun el criterio de precio pasado por param
const limitPageSortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    
    if(limit && page && !query && sort){
        if(isNaN(limit) || isNaN(page)){
            return res.status(400).json({status:'error', message:'Los parametros LIMIT y PAGE son de tipo numerico'});
        }

        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }

        let productsData = await mongoProductManager.getProductsPaginate(limit, page);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }

        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }

        let productsSorted = sortProducts(productsData.docs, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}

// 11. Combinacion page y query --> Filtra los productos de la pagina "page" de acuerdo a la categoria pasada por param
const pageQueryMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && page && query && !sort){
        
        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});
        
        if(isNaN(page)) return res.status(400).json({status:'error', message:'El parametro PAGE son de tipo numerico'});
    
        let productsData = await mongoProductManager.getProductsPaginate(10, page);
        
        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }

        let filteredProducts = filterByCategory(productsData.docs, query);
        let products = formatResults(productsData, filteredProducts);
        
        return res.status(201).json({MongoDBProdsLimitPage:products});
    }
    
    next();
}

// 12. Combinacion page y sort --> Retorna los productos de la pagina "page" ordenados por el criterio de precio pasado por param 
const pageSortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    
    if(!limit && page && !query && sort){
        if(isNaN(page)){
            return res.status(400).json({status:'error', message:'El parametro PAGE es de tipo numerico'});
        }

        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }

        let productsData = await mongoProductManager.getProductsPaginate(10, page);
        
        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }
        
        let productsSorted = sortProducts(productsData.docs, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}

// 13. Combinacion page, query y sort --> Retorna los productos de la pagina page, los filtra de acuerdo a la categoria pasada por "query" y los ordena por el criterio de precio
const pageQuerySortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && page && query && sort){
        
        if(isNaN(page)) return res.status(400).json({status:'error', message:'El parametro PAGE es de tipo numerico'});
        
        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});
        
        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }
        
        let productsData = await mongoProductManager.getProductsPaginate(10, page);
        
        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El argumento PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }

        let filteredProducts = filterByCategory(productsData.docs, query);
        let productsSorted = sortProducts(filteredProducts, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}

// 14. Combinacion query y sort --> Retorna los primeros 10 productos de la pagina 1 filtrados por la categoria pasada por "query" y ordenados por el criterio de precio
const querySortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(!limit && !page && query && sort){
        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});
        
        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }
        
        let productsData = await mongoProductManager.getProductsPaginate(10, 1);

        let filteredProducts = filterByCategory(productsData.docs, query);
        let productsSorted = sortProducts(filteredProducts, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}

// 15. Combinacion limit, query y sort => Retorna los primeros "limit" productos de la pagina 1 filtrados por la categoria pasada por "query" y ordenados por el criterio de precio
const limitQuerySortMid = async (req, res, next) => {
    let {limit, page, query, sort}  = req.query;
    
    if(limit && !page && query && sort){

        if(isNaN(limit)) return res.status(400).json({status:'error', message:'El parametro LIMIT es de tipo numerico'});

        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});

        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }
        
        let productsData = await mongoProductManager.getProductsPaginate(limit, 1);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }
        
        let filteredProducts = filterByCategory(productsData.docs, query);
        let productsSorted = sortProducts(filteredProducts, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    }
    
    next();
}
















// const noLimitMid = async (req, res, next) => {
//     let products = await mongoProductManager.getProducts();
    
//     if(Object.keys(req.query).length === 0) return res.status(200).json({status:'ok', MongoDBProducts:products}); 
    
//     next();
// }

// const nanLimitMid = (req, res, next) => {
//     let {limit} = req.query;
    
//     if(isNaN(limit)) return res.status(400).json({status:'error', message:'El argumento LIMIT es de tipo numerico'});

//     next();
// }

// const limitInvalidMid = async (req, res, next) => {
//     let products = await mongoProductManager.getProducts();
//     let {limit} = req.query;
    
//     if(parseInt(limit) < 1 || parseInt(limit) > products.length){
//         return res.status(400).send(`Error. LIMIT ${limit} no esta permitido. Por favor, ingrese un LIMIT entre 1 y ${products.length} inclusive`)
//     }

//     next();
// }

/*------------------------------*\
    #MIDDLEWARES GET '/:pid'
\*------------------------------*/

const invalidObjectIdMid = (req, res, next) => {
    let pid = req.params.pid;
    
    if(!mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({error:'El pid ingresado tiene un formato invalido'});

    next();
}

const invalidPidMid = async (req, res, next) => {
    let products = await mongoProductManager.getProducts();
    let pid = req.params.pid;
    
    let prodId = products.filter(product => product._id.equals(new mongoose.Types.ObjectId(pid)));
    
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
        return res.status(400).json({status: 'error', error:'Los campos title, description, code, price, status, stock y category son obligatorios. Ademas, el campo status se debe setear por defecto en true.'});
    }

    next();
}

const sameTitleMid = async (req, res, next) => {
    let {title} = req.body;
    
    const productWithSameTitle = await mongoProductManager.findByTitle(title); 
    if(productWithSameTitle){
        return res.status(400).json({status: 'error', error:'No se permiten agregar productos distintos que tengan el mismo titulo'});
    }

    next();
}

const sameDescriptionMid = async (req, res, next) => {
    let {description} = req.body;
    
    const productWithSameDescription = await mongoProductManager.findByDescription(description); 
    if(productWithSameDescription){
        return res.status(400).json({status: 'error', error:'No se permiten agregar productos distintos que tengan la misma descripcion'});
    }

    next();
}

const sameCodeMid = async (req, res, next) => {
    let {code} = req.body;
    
    const productWithSameCode = await mongoProductManager.findByCode(code); 
    if(productWithSameCode){
        return res.status(400).json({status: 'error', error:'No se permiten agregar productos distintos que tengan el mismo codigo'});
    }

    next();
}

const priceStockNegMid = (req, res, next) => {
    let {price, stock} = req.body;

    if(price <= 0 || stock <= 0){
        return res.status(400).json({status: 'error', error:'Los campos price y stock deben ser positivos.'});
    }

    next();
}

/*------------------------------*\
    #MIDDLEWARES PUT '/:pid'
\*------------------------------*/

const emptyFieldsModifyMid = (req, res, next) => {
    let fieldsToModify = req.body;

    for(const value of Object.values(fieldsToModify)){
        if(!value){
            return res.status(400).json({status: 'error', error:'Todos los campos que desea modificar tienen que estar completos.'});
        }
    }
    
    next();
}

/*------------------------------*\
        #PRODUCTS ROUTES
\*------------------------------*/

// , noLimitMid, nanLimitMid, limitInvalidMid,
router.get('/', noParamsMid, limitMid, pageMid, queryMid, sortMid, limitQueryMid, limitPageMid, limitSortMid, limitPageQueryMid, limitPageSortMid, pageQueryMid, pageSortMid, pageQuerySortMid, querySortMid, limitQuerySortMid, async (req, res) => {
    try {
        let {limit, page, query, sort}  = req.query;
        
        if(isNaN(limit) || isNaN(page)) return res.status(400).json({status:'error', message:'Los parametros LIMIT y PAGE son de tipo numerico'});

        if(!isNaN(query) && query < 0) return res.status(400).json({status:'error', message:'Cuando el parametro QUERY es de tipo Number, no se admiten stock negativos'});

        if(!isNaN(sort) || (sort !== ASC && sort !== DESC)){
            return res.status(400).json({status:'error', message:'El parametro SORT solo admite los valores asc o desc.'});
        }
        
        let productsData = await mongoProductManager.getProductsPaginate(limit, page);

        if(limit < 1 || limit > productsData.totalDocs){
            return res.status(400).json({status:'error', message:`El parametro LIMIT debe ser mayor igual a 1 y no debe superar la cantidad de documentos (${productsData.totalDocs}) de la coleccion`});
        }
        
        if(page < 1 || page > productsData.totalPages){
            return res.status(400).json({status:'error', message:`El parametro PAGE debe ser mayor igual a 1 y no debe superar la cantidad total de paginas (${productsData.totalPages}) de la coleccion`});
        }
        
        let filteredProducts = filterByCategory(productsData.docs, query);
        let productsSorted = sortProducts(filteredProducts, sort);
        let products = formatResults(productsData, productsSorted);
        
        return res.status(201).json({MongoDBProdsSortedAscPrice:products});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message})
    }
})

router.get('/:pid', invalidObjectIdMid, invalidPidMid, async (req, res) => {
    try {
        let pid = req.params.pid;
        
        let productSelected = await mongoProductManager.getProductById(pid); 
        res.status(200).json({status:'ok', MongoDBProduct:productSelected});                           
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.post('/', emptyFieldMid, sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, async (req,res) => {
    try {
        let newProd = req.body;
        let productAdded = await mongoProductManager.addProduct(newProd);

        res.status(201).json({status: 'ok', newProduct:productAdded})
        
    } catch (error) {
        res.status(500).json({error:'Error inesperado', detalle:error.message})
        
    }
})

router.put('/:pid', invalidObjectIdMid, invalidPidMid, emptyFieldsModifyMid, sameTitleMid, sameDescriptionMid, sameCodeMid, priceStockNegMid, async (req, res) => {
    try {
        let pid = req.params.pid;
        let fields = req.body;

        let updatedProds = await mongoProductManager.updateProduct(pid, fields);
    
        res.status(200).json({status: 'ok', updatedProducts: updatedProds});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.delete('/:pid', invalidObjectIdMid, invalidPidMid, async (req,res) => {
    try {
        let pid = req.params.pid;
        let delProduct = await mongoProductManager.deleteProduct(pid);
    
        res.status(200).json({status: 'ok', deletedProduct: delProduct});
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})