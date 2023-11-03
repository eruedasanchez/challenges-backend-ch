import fs from 'fs';
import __dirname from '../utils.js';

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let path = __dirname + '/data/products.json';

const filterProds = (arr, filters) => {
    let filteredProds = [];
    let filterEntries = Object.entries(filters);

    for(let i=0; i < filterEntries.length; i++){
        let currentProp = filterEntries[i][0];
        let currentValue = filterEntries[i][1];

        if(currentProp === "_id") currentValue = parseInt(currentValue);
        
        for(let j=0; j < arr.length; j++){
            if(currentValue === arr[j][currentProp]){
                filteredProds.push(arr[j]);
            }
        }
    }

    return filteredProds;
}

export class ProductsFsDAO{
    constructor(){}

    /**** Metodos ****/

    get(filter = {}){
        // if(letters.includes(filter["_id"])){
        //     throw new Error('El pid ingresado tiene un formato invalido');
        // } 

        // if(parseInt(filter["_id"]) < 1){
        //     throw new Error("Solo se admiten PID's mayores o iguales a 1");
        // }
        
        let products = [];
        
        if(fs.existsSync(path)){
            products = JSON.parse(fs.readFileSync(path, 'utf-8'));
        }

        let filteredProducts = filterProds(products, filter); 
        
        return filteredProducts;
    }

    add(newProd){
        let products = this.get();
        let _id = 1;

        if(products.length > 0) _id = products[products.length - 1]._id + 1;
        
        let newProduct = {_id, ...newProd};
        products.push(newProduct);

        fs.writeFileSync(path, JSON.stringify(products, null, '\t'));

        return newProduct;
    }

    update(id, fields){
        let products = this.get();
        let idxSelected = products.findIndex(prod => prod._id === parseInt(id));
        
        // El producto existe. Se modifican las propiedades pasadas por el body
        for(const entry of Object.entries(fields)){
            products[idxSelected][entry[0]] = entry[1];
        }

        fs.writeFileSync(path, JSON.stringify(products, null, '\t'));

        return products[idxSelected];
    }

    findBy(filter = {}){
        let products = this.get();

        let filteredProducts = filterProds(products, filter);
        
        return filteredProducts.length > 0;
    }

    delete(id){
        if(isNaN(id)) throw new Error('El pid ingresado tiene un formato invalido');

        if(id <= 1) throw new Error("Solo se admiten PID's mayores o iguales a 1");

        let products = this.get();
        
        const idxRemove = products.findIndex(prod => prod._id === id);
        products.splice(idxRemove, 1);
        
        fs.writeFileSync(path, JSON.stringify(products, null, '\t'));

        return products;
    }
}