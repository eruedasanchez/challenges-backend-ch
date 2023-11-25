import { config } from '../config/config.js';

let productsDAO;
let cartsDAO;
let messagesDAO = await import('./messagesMongoDAO.js');
messagesDAO = messagesDAO.MessagesMongoDAO;
let ticketsDAO;

switch (config.PERSISTENCE) {
    case "FS":
        productsDAO = await import('./productsFsDAO.js');
        cartsDAO = await import('./cartsFsDAO.js');
        productsDAO = productsDAO.ProductsFsDAO;
        cartsDAO = cartsDAO.CartsFsDAO;    
        break;

    case "MONGODB":
        productsDAO = await import('./productsMongoDAO.js');
        cartsDAO = await import('./cartsMongoDAO.js');
        ticketsDAO = await import('./ticketsMongoDAO.js');
        productsDAO = productsDAO.ProductsMongoDAO;
        cartsDAO = cartsDAO.CartsMongoDAO;
        ticketsDAO = ticketsDAO.TicketsMongoDAO;
        break;
    
    default:
        throw new Error("Persistencia invalida");
}

export { productsDAO, cartsDAO, messagesDAO, ticketsDAO };