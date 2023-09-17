const fs = require('fs');

const INCOMPLETE_FIELDS_ERR = "Error. All product fields must be complete!";
const SAME_CODE_ERR = "Error. Cannot be different products with the same code!";
const NOT_FOUND_SEARCH = "Error. The product you want search doesn't exist";
const NOT_FOUND_DEL = "Error. The product you want delete doesn't exist";
const UNDEF_FIELD_ERR = "Error. The field you want modify is not defined";

class ProductManager{
    
    constructor(path){
        this.path = path;
    } 
    
    /**** Metodos ****/ 
    
    addProduct(title, description, price, thumbnail, code, stock){
        let products = this.getProducts();

        let newProduct = {
            title: title, 
            description: description, 
            price: price, 
            thumbnail: thumbnail, 
            code: code, 
            stock: stock
        }

        const dataProduct = Object.values(newProduct);

        // Se chequea si alguna propiedad es nula
        const existsPropertyNull = (property) => property == null;
        
        if(dataProduct.some(existsPropertyNull)) return INCOMPLETE_FIELDS_ERR;
        
        // Se chequea si se repitieron los codigos en distintos productos
        const productWithSameCode = products.filter((prod) => prod.code === newProduct.code); // retorna un arreglo con los objetos (productos) que coincidan con el codigo del producto que se desea agregar
        
        if(productWithSameCode.length > 0) return SAME_CODE_ERR; 
        
        // El producto no tiene ningun campo vacio ni se repite ningun codigo
        if(products.length === 0){
            newProduct.id = 1;
        } else {
            newProduct.id = products.length + 1;
        }
        
        products.push(newProduct);
        
        return fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));
    }
    
    getProducts(){
        if(!fs.existsSync(this.path)) return [];
        
        let viewProducts = JSON.parse(fs.readFileSync(this.path, 'utf-8')); 
        return viewProducts;
    }
    
    getProductById(id){
        let products = this.getProducts();
        
        let foundProduct = products.find((prod) => prod.id === id);

        if(foundProduct){
            return foundProduct;
        } else {
            return NOT_FOUND_SEARCH;
        } 
    }

    updateProduct(id, field, content){
        let products = this.getProducts();
        let foundProduct = this.getProductById(id);

        if(foundProduct === NOT_FOUND_SEARCH) return NOT_FOUND_SEARCH;
        
        if(!Object.keys(foundProduct).includes(field)) return UNDEF_FIELD_ERR;
        
        // Se paso por parametro un campo que se encuentra definido  
        const idxFoundProduct = products.findIndex(prod => prod.id === id);
        foundProduct[field] = content;
        products[idxFoundProduct] = foundProduct;
        
        return fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));
    }
    
    deleteProduct(id){
        let products = this.getProducts();
        let foundProductById = this.getProductById(id);
        
        if(foundProductById !== NOT_FOUND_SEARCH){
            const idxRemoveProduct = products.findIndex(prod => prod.id === id);
            products.splice(idxRemoveProduct,1);
            return fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));;
        }
        
        return NOT_FOUND_DEL;
    }
}

let path = "./files/products.json";
let pm = new ProductManager(path);
pm.addProduct("Producto prueba uno", "Este es un producto prueba uno", 100, "Sin imagen", "abc120", 25);
pm.addProduct("Producto prueba dos", "Este es un producto prueba dos ", 200, "Sin imagen", "abc121", 24);
pm.addProduct("Producto prueba tres", "Este es un producto prueba tres", 300, "Sin imagen", "abc122", 23);
pm.addProduct("Producto prueba cuatro", "Este es un producto prueba cuatro", 400, "Sin imagen", "abc123", 22);
pm.addProduct("Producto prueba cinco", "Este es un producto prueba cinco", 500, "Sin imagen", "abc124", 21);
console.log(pm.getProducts());
console.log(pm.getProductById(2));
console.log(pm.deleteProduct(3));
console.log(pm.updateProduct(1, "pepe", "Producto prueba cinco modificado"));


