import fs from 'fs';

const filterProds = (arr, fltrs) => {
    let filters = Object.keys(fltrs);
    
    filters.forEach(filter => {
        arr = arr.filter(elem => elem[filter] === fltrs[filter]); 
    })
    
    return arr;
}

export class ProductsFsDAO{
    constructor(path){
        this.path = path;
    }

    /**** Metodos ****/

    get(filter = {}){
        let products = [];
        
        if(fs.existsSync(this.path)) products = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        
        return filterProds(products, filter);
    }

    add(newProd){
        let products = this.get();
        let _id = 1;

        if(products.length > 0) _id = products[products.length - 1]._id + 1;
        
        let newProduct = {_id, ...newProd};
        products.push(newProduct);
        fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));

        return newProduct;
    }

    update(id, fields){
        let products = this.get();
        let idxSelected = products.findIndex(prod => prod._id === id);
        
        // El producto existe. Se modifican las propiedades pasadas por el body
        for(const entry of Object.entries(fields)){
            products[idxSelected][entry[0]] = entry[1];
        }

        fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));

        return products[idxSelected];
    }

    delete(id){
        let products = this.get();
        
        const idxRemove = products.findIndex(prod => prod._id === id);
        products = products.filter(prod => prod !== products[idxRemove]);
        
        fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));

        return products;
    }
}