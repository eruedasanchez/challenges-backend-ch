import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js"; 

export const invalidObjectCidMid = cid => {
    if(!mongoose.Types.ObjectId.isValid(cid)){
        throw new Error('El CID ingresado tiene un formato invalido');
    }
}

const invalidObjectPidMid = pid => {
    if(!mongoose.Types.ObjectId.isValid(pid)){
        throw new Error('El PID ingresado tiene un formato invalido');
    }
}

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
        invalidObjectCidMid(filter["_id"]);
        
        let query = cartsModel.find(filter);
        
        for (const operation of operations) {
            if (operation === ops.POPULATE){
                query = query.populate('products.productId');
            } else if (operation === ops.LEAN) query = query.lean();
        }
        
        return await query.exec();
    }
    
    async add(cid, pid){
        invalidObjectPidMid(pid);
        
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
        invalidObjectCidMid(cid);

        let productos = prods.products;
        
        for(const prod of productos){
            if(!mongoose.Types.ObjectId.isValid(prod.productId)){
                // invalidObjectProductIdMid
                throw new Error('Todos los productId ingresados deben ser de tipo ObjectId');
            } 
        }
        
        return await cartsModel.updateOne({_id: cid}, prods);
    }

    async updateCant(cid, pid, field){
        invalidObjectCidMid(cid);
        invalidObjectPidMid(pid);

        let cartSelected = await this.get({_id:cid});
        let productsSelected = cartSelected[0].products;
        let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));

        if(idxPid === -1){
            // inexistsPidInProductCartMid
            throw new Error(`El producto con PID ${pid} no existe en el carrito con CID ${cid}.`);
        }
        
        let quantityProp = Object.keys(field)[0]; 
        let quantityValue = Object.values(field)[0];
        productsSelected[idxPid][quantityProp] = quantityValue;
        
        await cartSelected[0].save();
        return cartSelected[0];
    }
    
    async delete(cid, pid){
        invalidObjectCidMid(cid);
        invalidObjectPidMid(pid);

        let cartSelected = await this.get({_id:cid});
        let productsSelected = cartSelected[0].products;
        let idxPid = productsSelected.findIndex(prod => prod.productId.equals(new mongoose.Types.ObjectId(pid)));
        
        if(idxPid === -1){
            // inexistsPidInProductCartMid
            throw new Error(`El producto con PID ${pid} no existe en el carrito con CID ${cid}.`);
        }
        
        let updatedProducts = productsSelected.filter(prod => prod !== productsSelected[idxPid]);
        
        return cartsModel.updateOne({_id: cid}, {$set:{products:updatedProducts}});
    }
    
    async deleteAll(cid){
        invalidObjectCidMid(cid);
        
        return await cartsModel.updateOne({_id: cid}, {$set:{products:[]}});
    }
}

