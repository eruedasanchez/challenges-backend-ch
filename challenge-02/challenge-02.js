const fs = require('fs');

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
        
        if(dataProduct.some(existsPropertyNull)) return console.log("Error. All product fields must be complete!");
        
        // Se chequea si se repitieron los codigos en distintos productos
        const productWithSameCode = products.filter((prod) => prod.code === newProduct.code); // retorna un arreglo con los objetos (productos) que coincidan con el codigo del producto que se desea agregar
        
        if(productWithSameCode.length > 0) return console.log("Error. Cannot be different products with the same code!"); 
        
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

        if(foundProduct) return foundProduct;
        return "Product not found"; 
    }

    updateProduct(id, field, content){
        let products = this.getProducts();
        let foundProduct = this.getProductById(id);
        
        if(!Object.keys(foundProduct).includes(field)){
            console.log("El campo que desea modificar no se encuentra definido");
            return;
        }
        
        // Se paso por parametro un campo que se encuentra definido  
        const keys = Object.keys(foundProduct);
        const idxToModify = keys.findIndex(key => key === field);
        const key = keys[idxToModify]; 
        
        foundProduct[key] = content;
        products[id-1] = foundProduct;
        
        return fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));
    }
    
    deleteProduct(id){
        let products = this.getProducts();
        let foundProductById = this.getProductById(id);
        
        if(foundProductById){
            const idxRemoveProduct = foundProductById.id - 1;
            products.splice(idxRemoveProduct,1);
            return fs.writeFileSync(this.path, JSON.stringify(products, null, '\t'));;
        }
        
        return console.log("El producto que desea eliminar no existe");
    }
}

let path = "./files/products.json";
let pm = new ProductManager(path);
console.log(pm.getProducts());
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(pm.getProducts());
console.log(pm.getProductById(1));
pm.updateProduct(1, "price", 1000);
console.log(pm.getProducts());
pm.deleteProduct(1);
console.log(pm.getProducts());
