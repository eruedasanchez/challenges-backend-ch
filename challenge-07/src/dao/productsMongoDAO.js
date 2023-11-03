import mongoose from 'mongoose';
import { productsModel } from "./models/products.model.js";


export class ProductsMongoDAO{
    constructor(){}

    /**** Metodos ****/
    
    async get(filter = {}){
        return await productsModel.find(filter);
    }
    
    async add(newProd){
        return await productsModel.create(newProd);
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
        if(!mongoose.Types.ObjectId.isValid(id)){
            // Invalid ObjectId Middleware
            throw new Error('El pid ingresado tiene un formato invalido');
        }
        
        let products = await this.get();
        let prodId = products.filter(product => product._id.equals(new mongoose.Types.ObjectId(id)));
        
        if(prodId.length === 0){
            // Invalid Pid Middleware
            throw new Error(`El producto con PID ${id} no existe`); // Caso en el que se cumple http://localhost:8080/api/products/34123123
        }
        
        return await productsModel.deleteOne({_id:id});
    }
}

