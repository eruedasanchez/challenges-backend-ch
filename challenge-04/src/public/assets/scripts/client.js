const socket = io();  // Dejamos a nuestro frontend atento para conectarse a un servidor

socket.on('newProduct', (newProduct, products) => {
    console.log(`Se ha agregado el ${newProduct.title} a la lista de productos`);

    let ul = '';
    products.forEach(prod => {
        ul += `
                <li>Titulo del producto: ${prod.title}</li>
                <li>Id del producto: ${prod.id}</li>
                <li>Titulo del producto: ${prod.title}</li>
                <li>Descripcion del producto: ${prod.description}</li>
                <li>Codigo del producto: ${prod.code}</li>
                <li>Precio del producto: ${prod.price}</li>
                <li>Status del producto: ${prod.status}</li>
                <li>Stock del producto: ${prod.stock}</li>
                <li>Categoria del producto: ${prod.category}</li>
                <li>Thumbnails: ${prod.thumbnails}</li>
                <br>
                <br>
            `;
    });
    
    let productsRealTime = document.getElementById('productsRealTime');
    productsRealTime.innerHTML = ul;
})

socket.on('deletedProduct', (deletedProduct, products) => {
    console.log(`Se ha eliminado el ${deletedProduct.title} de la lista de productos`);
    
    let ul = '';
    products.forEach(prod => {
        ul += `
                <li>Titulo del producto: ${prod.title}</li>
                <li>Id del producto: ${prod.id}</li>
                <li>Titulo del producto: ${prod.title}</li>
                <li>Descripcion del producto: ${prod.description}</li>
                <li>Codigo del producto: ${prod.code}</li>
                <li>Precio del producto: ${prod.price}</li>
                <li>Status del producto: ${prod.status}</li>
                <li>Stock del producto: ${prod.stock}</li>
                <li>Categoria del producto: ${prod.category}</li>
                <li>Thumbnails: ${prod.thumbnails}</li>
                <br>
                <br>
            `;
    });
    
    let productsRealTime = document.getElementById('productsRealTime');
    productsRealTime.innerHTML = ul;
})

const loadProducts = async () => {
    const response = await fetch('/api/products');      
    const data = await response.json();

    let products = data.prods;
    
    let ul = '';
    products.forEach(prod => {
        ul += `
            <li>Titulo del producto: ${prod.title}</li>
            <li>Id del producto: ${prod.id}</li>
            <li>Titulo del producto: ${prod.title}</li>
            <li>Descripcion del producto: ${prod.description}</li>
            <li>Codigo del producto: ${prod.code}</li>
            <li>Precio del producto: ${prod.price}</li>
            <li>Status del producto: ${prod.status}</li>
            <li>Stock del producto: ${prod.stock}</li>
            <li>Categoria del producto: ${prod.category}</li>
            <li>Thumbnails: ${prod.thumbnails}</li>
            <br>
            <br>
        `;
    });
    
    let productsRealTime = document.getElementById('productsRealTime');
    productsRealTime.innerHTML = ul;
}

loadProducts();

// Se intenta pushear el archivo client.js que no se dejaba ver anteriormente










