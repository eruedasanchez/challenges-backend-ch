class ProductManager{
    
    constructor(){
        this.products = [];
        this.path = './files/products.json';
    } 
    
    /**** Metodos ****/ 
    
    addProduct(title, description, price, thumbnail, code, stock){
        const fs = require('fs');
        
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

        if(dataProduct.some(existsPropertyNull)){
            return console.log("Error. All product fields must be complete!");
        }
        
        const productWithSameCode = this.products.filter((prod) => prod.code === newProduct.code); // retorna un arreglo con los objetos (productos) que coincidan con el codigo del producto que se desea agregar
        
        if(productWithSameCode.length > 0){
            // se repitieron los codigos en distintos productos
            return console.log("Error. Cannot be different products with the same code!"); 
        }
        
        if(this.products.length === 0){
            newProduct.id = 1;
        } else {
            newProduct.id = this.products.length + 1;
        }

        this.products.push(newProduct);
        
        return fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'));
    }
    
    getProducts(){
        const fs = require('fs');

        let viewProducts = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        return console.log(viewProducts);
    }
    
    getProductById(id){
        const fs = require('fs');

        let dataProducts;

        if(fs.existsSync(this.path)){
            dataProducts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        }

        const foundProduct = dataProducts.find((prod) => prod.id === id);

        if(foundProduct) return foundProduct;
        return console.log("Not found"); 
    }

    // updateProduct(id, campo, content){
    //     const fs = require('fs');

    //     let dataProducts;

    //     if(fs.existsSync(this.path)){
    //         dataProducts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
    //     }

    //     const foundProductById = dataProducts.find((prod) => prod.id === id);
        
    //     if(foundProductById){
    //         foundProductById.campo = content;
    //     }

    //     return console.log(fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t')));
    // }
    
    deleteProduct(id){
        const foundProductById = this.getProductById(id);
        
        if(foundProductById){
            const idxRemoveProduct = foundProductById.id - 1;
            this.products.splice(idxRemoveProduct,1);
            return this.products;
        }
        
        return console.log("El producto que desea eliminar no existe");
    }
}

let pm = new ProductManager();
pm.getProducts();
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
pm.getProducts();
// pm.getProductById(1);
// // pm.updateProduct(1, "price", 400);
// pm.deleteProduct(1);
// pm.getProducts();
