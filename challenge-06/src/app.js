import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import passport from 'passport';
import {Server} from 'socket.io';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';
import {router as viewsRouter} from './routes/views.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import {initChat, router as chatRouter} from './routes/chat.router.js';
import { initPassport } from './config/passport.config.js';

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

app.use(session({
    secret: 'claveSecreta',
    resave: true,
    saveUninitialized: true,
    store: ConnectMongo.create({
        mongoUrl: 'mongodb+srv://ezequielruedasanchez:1I5FoZoRlSaz5TsX@cluster0.4vp9khz.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce',
        ttl: 300
    })
}))

// 2. cargar passport en nuestra aplicacion (en app.js) ejemplo github y local
initPassport();
app.use(passport.initialize());
app.use(passport.session()); // por esto, siempre se ejecuta passport despeus de la sesion (app.use(session(...)

// 3. cargar el middleware de passport en sessions router

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

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

// Ultimo commit Challenge-06+RuedaSanchez 


