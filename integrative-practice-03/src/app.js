import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
// import nodemailer from 'nodemailer';
// import multer from 'multer';
import {Server} from 'socket.io';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';
import {router as viewsRouter} from './routes/views.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as usersRouter } from './routes/users.router.js';
import {initChat, router as chatRouter} from './routes/chat.router.js';
import { initPassport } from './config/passport.config.js';
import { config } from './config/config.js';
import { errorHandler } from './services/errors/errorsHandler.js';
import { middLog, logger } from './utilsWinston.js';

const PORT = config.PORT;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './src/tmp/uploads')
//     },
//     filename: function (req, file, cb) {
//         // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

const PERSISTENCE = config.PERSISTENCE;
logger.info(`Persistencia en ${PERSISTENCE} iniciada`);



// const enviar = async (to, subject, message, adjuntos=[]) => {
//     let attachments = [];

//     adjuntos.forEach(adjunto => {
//         attachments.push({
//             path: adjunto.path,
//             filename: adjunto.filename
//         })
//     })

//     return transporter.sendMail({
//         from: 'Ezequiel <ezequiel.ruedasanchez@gmail.com>',
//         to: to,
//         subject: subject,
//         html: `
//         <p style="color:blue; background-color:red">${message}</p>
//         <img src="cid:adjunto01">`,
//         // agregamos archivos adjuntos
//         attachments: attachments
//     });
// }

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(middLog);

app.engine('handlebars', handlebars.engine()); 
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

// Inicializacion cookie parser para acceder a la gestion de cookies desde express 
app.use(cookieParser());

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
// app.use(passport.session()); // por esto, siempre se ejecuta passport despues de la sesion (app.use(session(...)

// 3. cargar el middleware de passport en sessions router

app.use('/api/sessions', sessionsRouter);

// app.post('/mail', upload.array("adjuntos"), async (req,res) =>  {
//     let {to, subject, message} = req.body;

    // console.log("req.file", req.file);
    // console.log("req.files", req.files);

//     let resultado = await enviar(to, subject, message, req.files);


//     res.setHeader('Content-Type', 'text/plain');
//     return res.status(200).json({payload: resultado});

// })

app.use('/api/users', usersRouter);
app.use('/', viewsRouter);


// Middlewares de Errores
app.use(errorHandler);

const serverExpress = app.listen(PORT, () => {
    logger.info(`Server escuchando en puerto ${PORT}`);
});

// serverSocket para el servidor de socket.io
export const serverSocket = new Server(serverExpress);

initChat(serverSocket);

// Se establece la conexion con la base de datos de MongoDB Atlas
try {
    await mongoose.connect(config.MONGO_URL, {dbName: config.DB_NAME});
    logger.info('MongoDB Atlas Conectada');
} catch (error) {
    logger.fatal(`Error al conectarse con MongoDB Atlas. Detalle: ${error.message}`);
}

// Ultimo commit Challenge-09+RuedaSanchez 

// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//     // transporte valido solo para gmail por eso utilizamos serivce y el puerto 587
//     service: 'gmail',
//     port: '587',
//     auth: {
//         user: 'ezequiel.ruedasanchez@gmail.com',
//         pass: 'szmiutoluzhlmeps'
//     }
// })

// const enviar = async () => {
//     return transporter.sendMail({
//         from: 'Ezequiel <ezequiel.ruedasanchez@gmail.com>',
//         to: 'ezequiel.ruedasanchez@gmail.com',
//         subject: 'prueba email con adjuntos ahora',
//         html: `
//         <p style="color:blue; background-color:red">Prueba de email simple</p>
//         <img src="cid:adjunto01">`,
//         // agregamos archivos adjuntos
//         attachments: [
//             {
//                 path: path.join(__dirname, "public/assets/img/diego10.jpg"),
//                 filename: "diego10.jpg",
//                 cid: 'adjunto01'
//             }
//         ]
//     });
// }

// enviar()
//     .then(result => console.log(result))
//     .catch(error => console.log(error))


