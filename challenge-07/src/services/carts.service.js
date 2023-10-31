import {CartsMongoDAO as DAO} from "../dao/cartsMongoDAO.js";

class CartsService{
    constructor(dao){
        this.dao = new dao(); 
    }
    
    async createCart(){
        return await this.dao.create(); 
    }

    async getCarts(){
        return await this.dao.getPopulate();
    }

    async getCartById(cid){
        return await this.dao.getPopulate({_id:cid});
    }

    async getCartByIdLean(cid){
        return await this.dao.getLean({_id:cid});
    }

    async getCartByIdWithoutPopulate(cid){
        return await this.dao.get({_id:cid}); 
    }
    
    async addProduct(cid, pid){
        return await this.dao.add(cid, pid);
    }

    async updateProducts(cid, prods){
        return await this.dao.update(cid, prods); 
    }

    async updateQuantity(cid, pid, field){
        return await this.dao.updateCant(cid, pid, field);
    }
    
    async deleteProduct(cid, pid){
        return await this.dao.delete(cid, pid);
    }

    async deleteAllProducts(cid){
        return await this.dao.deleteAll(cid); 
    }
}

export const cartsService = new CartsService(DAO);