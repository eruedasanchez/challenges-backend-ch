import { productsModel } from "../models/products.model.js";

class MongoProductManager{
    
    /**** Metodos ****/

    addProduct(newProd){
        return productsModel.create(newProd);
    }
    
    getProducts(){
        return productsModel.find();
    }

    getLimitedProducts(lim){
        return productsModel.find().limit(lim);
    }
    
    getProductById(id){
        return productsModel.findById(id);
    }

    updateProduct(id, fields){
        return productsModel.updateOne({_id:id}, fields);
    }

    findByCode(cod){
        return productsModel.findOne({code:{$eq:cod}});
    }
    
    deleteProduct(id){
        return productsModel.deleteOne({_id:id});
    }
}

export default MongoProductManager;



