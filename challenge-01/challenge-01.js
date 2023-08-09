class ProductManager{
    
    constructor(){
        this.products = [];
    } 
    
    /**** Metodos ****/ 
    
    addProduct(title, description, price, thumbnail, code, stock){
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
        
        return this.products.push(newProduct);
    }
    
    getProducts(){
        console.log(this.products);
    }
    
    getProductById(id){
        const foundProduct = this.products.find((prod) => prod.id === id);

        if(foundProduct) return console.log(foundProduct);
        return console.log("Not found"); 
    }
}

let pm = new ProductManager();
pm.getProducts();
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
pm.getProducts();
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
pm.getProductById(3);
