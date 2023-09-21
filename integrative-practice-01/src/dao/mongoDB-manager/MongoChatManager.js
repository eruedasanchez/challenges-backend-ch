import { messagesModel } from "../models/messages.model.js";

class MongoChatManager{
    
    /**** Metodos ****/

    // createCart(){
    //     let newCart = { products: [] };
    //     return cartsModel.create(newCart); 
    // }

    // getCarts(){
    //     return cartsModel.find();
    // }

    // async getCartById(cid){
    //     return await cartsModel.findById(cid);
    // }
    
    // async addProduct(cid, pid){
    //     let cartSelected = await this.getCartById(cid);
    //     let productsSelected = cartSelected.products;
    //     let idxPid = productsSelected.findIndex(prod => prod.productId === pid);
        
    //     if(idxPid === -1){
	//  	    // El producto no se encuentra definido en esta orden de compra.
	//  		// Se agrega de a una unidad como solicita el enunciado
	// 		let newProductAdded = {
	// 			productId: pid,
	// 			quantity: 1 
	// 		}
	// 		productsSelected.push(newProductAdded);
	// 	} else {
	//  		// Se aumenta en uno la cantidad del producto como solicita el enunciado
    //         productsSelected[idxPid].quantity += 1;
	// 	}
        
    //     await cartSelected.save();

    //     return cartSelected;
    // }
}

export default MongoChatManager;
