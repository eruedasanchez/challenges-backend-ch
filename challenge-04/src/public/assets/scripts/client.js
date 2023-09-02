const socket = io();  // dejamos a nuestro frontend atento para conectarse a un servidor

socket.on('newProduct', (newProduct, products) => {
    console.log(`Se ha dado de alta a ${newProduct.title}`);

    let ul = '';
    products.forEach(prod => {
        ul += `
                <li>${prod.title}</li>
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

const cargaProductos = async () => {
    const response = await fetch('/api/products');      
    const data = await response.json();

    let products = data.prods;
    
    let ul = '';
    products.forEach(prod => {
        ul += `
            <li>${prod.title}</li>
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

cargaProductos();









