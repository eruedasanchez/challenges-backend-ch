import { productsModel } from "./models/products.model.js";

export class ProductsMongoDAO{
    constructor(){}

    /**** Metodos ****/
    
    async add(newProd){
        return await productsModel.create(newProd);
    }
    
    async get(filter = {}){
        return await productsModel.find(filter);
    }
    
    async paginate(lim, pag){
        return productsModel.paginate({}, {limit:lim, lean:true, page:pag})
    }
    
    async limit(lim){
        return await productsModel.find().limit(lim);
    }
    
    async update(id, fields){
        return await productsModel.updateOne({_id:id}, fields);
    }
    
    async findBy(filter = {}){
        return await productsModel.findOne(filter);
    }
    
    async delete(id){
        return await productsModel.deleteOne({_id:id});
    }
}