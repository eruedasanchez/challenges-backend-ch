import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import {Server} from 'socket.io';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';
import {router as viewsRouter} from './routes/views.router.js';
import {initChat, router as chatRouter} from './routes/chat.router.js';

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine()); 
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);
app.use('/', viewsRouter);


const serverExpress = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

// serverSocket para el servidor de socket.io
export const serverSocket = new Server(serverExpress);

initChat(serverSocket);

// Se establece la conexion con la base de datos de MongoDB Atlas
try {
    await mongoose.connect("mongodb+srv://ezequielruedasanchez:1I5FoZoRlSaz5TsX@cluster0.4vp9khz.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce");
    console.log('MongoDB Atlas Conectada');
} catch (error) {
    console.log(error.message);
}

// Ultimo commit Practica-Integradora-01


