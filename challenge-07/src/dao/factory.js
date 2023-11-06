import { config } from '../config/config.js';

let productsDAO;
let cartsDAO;
let messagesDAO = await import('./messagesMongoDAO.js');
messagesDAO = messagesDAO.MessagesMongoDAO;

switch (config.PERSISTENCE) {
    case "FS":
        console.log("Persistencia en Archivos (FS) iniciada");
        productsDAO = await import('./productsFsDAO.js');
        cartsDAO = await import('./cartsFsDAO.js');
        productsDAO = productsDAO.ProductsFsDAO;
        cartsDAO = cartsDAO.CartsFsDAO;    
        break;

    case "MONGODB":
        console.log("Persistencia en MongoDB iniciada");
        productsDAO = await import('./productsMongoDAO.js');
        cartsDAO = await import('./cartsMongoDAO.js');
        productsDAO = productsDAO.ProductsMongoDAO;
        cartsDAO = cartsDAO.CartsMongoDAO;
        break;
    
    default:
        throw new Error("Persistencia invalida");
}

export { productsDAO, cartsDAO, messagesDAO };