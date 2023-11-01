import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js"; 

export const ops = {
    POPULATE:'populate', 
    LEAN: 'lean'
};

export class CartsMongoDAO{
    constructor(){}
    
    /**** Metodos ****/

    async create(){
        let newCart = { products: [] };
        return await cartsModel.create(newCart); 
    }
    
    async get(filter = {}, ...operations) {
        let query = cartsModel.find(filter);
        
        for (const operation of operations) {
            if (operation === ops.POPULATE){
                query = query.populate('products.productId');
            } else if (operation === ops.LEAN) query = query.lean();
        }

        return await query.exec();

    }
    
    async add(cid, pid){
        let cartSelected = await this.get({_id:cid});
        let productsSelected = cartSelected[0].products;
        let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));
        
        if(idxPid === -1){
	 	    // El producto no se encuentra definido en esta orden de compra.
	 		// Se agrega de a una unidad como solicita el enunciado
			let newProductAdded = {
				productId: pid,
				quantity: 1 
			}
			productsSelected.push(newProductAdded);
		} else {
	 		// Se aumenta en uno la cantidad del producto como solicita el enunciado
            productsSelected[idxPid].quantity += 1;
		}
        
        await cartSelected[0].save();

        return cartSelected[0];
    }

    async update(cid, prods){
        return await cartsModel.updateOne({_id: cid}, prods);
    }

    async updateCant(cid, pid, field){
        let cartSelected = await this.get({_id:cid});
        let productsSelected = cartSelected[0].products;
        let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));
        
        let quantityProp = Object.keys(field)[0]; 
        let quantityValue = Object.values(field)[0];
        productsSelected[idxPid][quantityProp] = quantityValue;
        
        await cartSelected[0].save();
        return cartSelected[0];
    }
    
    async delete(cid, pid){
        let cartSelected = await this.get({_id:cid});
        let productsSelected = cartSelected[0].products;
        let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));
        
        let updatedProducts = productsSelected.filter(prod => prod !== productsSelected[idxPid]);
        
        return cartsModel.updateOne({_id: cid}, {$set:{products:updatedProducts}});
    }
    
    async deleteAll(cid){
        return await cartsModel.updateOne({_id: cid}, {$set:{products:[]}});
    }
}

