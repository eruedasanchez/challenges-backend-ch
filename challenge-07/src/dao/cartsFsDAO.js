import fs from 'fs';

const filterCarts = (arr, fltrs) => {
    let filters = Object.keys(fltrs);
    
    filters.forEach(filter => {
        arr = arr.filter(elem => elem[filter] === fltrs[filter]); 
    })
    
    return arr;
}

export class CartsFsDAO{
    constructor(path){
        this.path = path;
    }

    /**** Metodos ****/

    get(filter = {}){
        let carts = [];

        if(fs.existsSync(this.path)) carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        
        return filterCarts(carts, filter);
    }

    create(){
        let carts = this.get();

        let _id = 1;
        if(carts.length > 0) _id = carts[carts.length-1]._id + 1;

        let newCart = {
			_id, 
			products: []
        }

        fs.writeFileSync(this.path, JSON.stringify(carts, null, '\t'));
        carts.push(newCart);
        
        return newCart;
    }

    add(cid, pid){
		let carts = this.get();
    
		let idxCart = carts.findIndex(cart => cart._id === cid);
		let productsSelected = carts[idxCart].products;
		
		let idxPid = productsSelected.findIndex(prod => prod._id === pid);
		if(idxPid === -1){
			// El producto no se encuentra definido en esta orden de compra.
			// Se agrega de a una unidad como solicita el enunciado
			let productAdded = {
				productId: pid,
				quantity: 1 
			}

			productsSelected.push(productAdded);
			carts[idxCart].products = productsSelected; 
		} else {
			// Se aumenta en uno la cantidad del producto como solicita el enunciado
			productsSelected[idxPid].quantity += 1;
		}

        fs.writeFileSync(this.path, JSON.stringify(carts, null, '\t'))

		return carts[idxCart];
	}
}