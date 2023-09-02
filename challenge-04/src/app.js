import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';
import {router as viewsRouter} from './routes/views.router.js';
import {Server} from 'socket.io';
import products from "./data/products.json" assert {type: "json"}; 

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars',handlebars.engine()); 
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/realtimeproducts', viewsRouter);

app.get('/', (req,res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home', {
        header: 'Products',
        products: products
    });
});

const serverExpress = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

// serverSocket lo utilizamos para el servidor de socket.io
export const serverSocket = new Server(serverExpress);

serverSocket.on('connection', socket => {
    console.log(`Se ha conectado un cliente con ID ${socket.id}`);

//     // Le envia una respuesta al frontend que se conecto (en home.js)
//     socket.emit('bienvenida', {message: 'Bienvenido al server! Por favor, identifiquese'});

//     // Recibo la identificacion del nombre enviado por el frontend (Juancito)
//     socket.on('identificacion', nombre => {
//         console.log(`Se ha conectado ${nombre}`);
//         // Se le notifica al frontend que recibio correctamente el nombre
//         socket.emit('idCorrecto', {message:`Hola ${nombre}, bienvenido!`});

//         // Con socket.broadcast.emit(), el server le emite un mensaje a todos menos al ultimo que le envio 
//         socket.broadcast.emit('nuevoUsuario', nombre);
//     })
})










