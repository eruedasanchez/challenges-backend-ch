import MongoProductManager from '../dao/mongoDB-manager/MongoProductManager.js';
import { productsService } from '../services/products.service.js';

const mongoProductManager = new MongoProductManager();

async function getProducts(req, res) {
    // Caso donde se aplican todos los filtros (limit, page, query y sort)
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
}

async function postProduct(req,res){
    try {
        let newProd = req.body;
        // let productAdded = await mongoProductManager.addProduct(newProd);
        let productAdded = await productsService.addProduct(newProd); // uno la capa de servicio con la de controller

        res.status(201).json({status: 'ok', newProduct:productAdded})
        
    } catch (error) {
        res.status(500).json({error:'Error inesperado', detalle:error.message})
        
    }
}

export default {getProducts, postProduct};
