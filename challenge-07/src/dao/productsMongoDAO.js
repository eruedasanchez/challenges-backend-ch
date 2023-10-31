import { productsModel } from "./models/products.model.js";

export class ProductsMongoDAO{
    constructor(){}

    /**** Metodos ****/

    // addProduct(newProd){
    //     return productsModel.create(newProd);
    // }

    async add(newProd){
        return await productsModel.create(newProd);
    }
    
    async get(filter = {}){
        if(filter["_id"] && !mongoose.Types.ObjectId.isValid(filter["_id"])){
            throw new Error('Id de usuario inválido');
        }
        
        return await productsModel.find(filter);
    }
    
    // getProducts(){
    //     return productsModel.find();
    // }

    // getProductById(id){
    //     return productsModel.findById(id);
    // }

    async paginate(lim, pag){
        return productsModel.paginate({}, {limit:lim, lean:true, page:pag})
    }
    
    // getProductsPaginate(lim, pag){
    //     return productsModel.paginate({}, {limit:lim, lean:true, page:pag});
    // }
    
    async limit(lim){
        return await productsModel.find().limit(lim);
    }

    // getLimitedProducts(lim){
    //     return productsModel.find().limit(lim);
    // }
    
    async update(id, fields){
        return await productsModel.updateOne({_id:id}, fields);
    }
    
    // updateProduct(id, fields){
    //     return productsModel.updateOne({_id:id}, fields);
    // }


    async findBy(filter = {}){
        return await productsModel.findOne(filter);
    }

    
    // findByTitle(ttl){
    //     return productsModel.findOne({title:{$eq:ttl}});
    // }

    // findByDescription(des){
    //     return productsModel.findOne({description:{$eq:des}});
    // }

    // findByCode(cod){
    //     return productsModel.findOne({code:{$eq:cod}});
    // }
    
    async delete(id){
        return await productsModel.deleteOne({_id:id});
    }
    
    // deleteProduct(id){
    //     return productsModel.deleteOne({_id:id});
    // }
}