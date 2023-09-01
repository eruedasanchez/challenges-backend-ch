import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import {router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js';
import {router as viewsRouter} from './routes/views.router.js';
import {Server} from 'socket.io';
import products from "./data/products.json" assert {type: "json" }; 

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
    res.status(200).render('home',{
        products: products
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});







// const demonSlayer = [
//     {
//         id: 1,
//         name: "Tanjiro Kamado",
//         powers: ["Breathing Techniques", "Water Breathing"],
//         role: "Main Protagonist",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 2,
//         name: "Nezuko Kamado",
//         powers: ["Demon Abilities", "Blood Demon Art"],
//         role: "Main Protagonist",
//         team: "None",
//         demonSlayer: false
//     },
//     {
//         id: 3,
//         name: "Zenitsu Agatsuma",
//         powers: ["Breathing Techniques", "Thunder Breathing"],
//         role: "Main Character",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 4,
//         name: "Inosuke Hashibira",
//         powers: ["Beast Breathing", "Boar Mask"],
//         role: "Main Character",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 5,
//         name: "Kyojuro Rengoku",
//         powers: ["Flame Breathing", "Fire Sword"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 6,
//         name: "Enmu",
//         powers: ["Morphing", "Blood Demon Art"],
//         role: "Lower Moon One",
//         team: "Twelve Kizuki",
//         demonSlayer: false
//     },
//     {
//         id: 7,
//         name: "Rui",
//         powers: ["Spider Threads", "Blood Demon Art"],
//         role: "Lower Moon Five",
//         team: "Twelve Kizuki",
//         demonSlayer: false
//     },
//     {
//         id: 8,
//         name: "Shinobu Kocho",
//         powers: ["Insect Breathing", "Venomous Wasp"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 9,
//         name: "Muzan Kibutsuji",
//         powers: ["Demon Abilities", "Blood Manipulation"],
//         role: "Main Antagonist",
//         team: "None",
//         demonSlayer: false
//     },
//     {
//         id: 10,
//         name: "Giyu Tomioka",
//         powers: ["Water Breathing", "Water Hashira"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 11,
//         name: "Muichiro Tokito",
//         powers: ["Mist Breathing", "Mist Hashira"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 12,
//         name: "Tengen Uzui",
//         powers: ["Sound Breathing", "Sound Hashira"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 13,
//         name: "Akaza",
//         powers: ["Upper Moon Three", "Demon Abilities"],
//         role: "Twelve Kizuki",
//         team: "None",
//         demonSlayer: false
//     },
//     {
//         id: 14,
//         name: "Kanao Tsuyuri",
//         powers: ["Flower Breathing", "Kaleidoscope Sword"],
//         role: "Demon Slayer",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 15,
//         name: "Kyogai",
//         powers: ["Temari Ball", "Demon Abilities"],
//         role: "Demon",
//         team: "Twelve Kizuki",
//         demonSlayer: false
//     },
//     {
//         id: 16,
//         name: "Genya Shinazugawa",
//         powers: ["Mouth Demon Slayer", "Demon Abilities"],
//         role: "Demon Slayer",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 17,
//         name: "Sanemi Shinazugawa",
//         powers: ["Wind Breathing", "Wind Hashira"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 18,
//         name: "Kokushibo",
//         powers: ["Upper Moon One", "Demon Abilities"],
//         role: "Twelve Kizuki",
//         team: "None",
//         demonSlayer: false
//     },
//     {
//         id: 19,
//         name: "Mitsuri Kanroji",
//         powers: ["Love Breathing", "Love Hashira"],
//         role: "Hashira",
//         team: "Demon Slayer Corps",
//         demonSlayer: true
//     },
//     {
//         id: 20,
//         name: "Yushiro",
//         powers: ["Demon Abilities", "Blood Manipulation"],
//         role: "Demon",
//         team: "None",
//         demonSlayer: false
//     }
// ];

// Configuracion de handlebars





// app.get('/demon', (req,res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).json(demonSlayer);
// })

// Creacion de un personaje
// app.post('/demon', (req,res) => {
//     let personaje = req.body;

//     demonSlayer.push(personaje);
//     serverSocket.emit('nuevoPersonaje', personaje, demonSlayer);

//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).json(personaje);
// })


// const serverExpress = app.listen(PORT, () => {
//     console.log(`Server escuchando en puerto ${PORT}`);
// });

// serverSocket lo utilizamos para el servidor de socket.io
// const serverSocket = new Server(serverExpress);

// serverSocket.on('connection', socket => {
//     console.log(`Se ha conectado un cliente con id ${socket.id}`);

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
// })

// Ultima forma de comunicarse con el frontend

// setInterval(() => {
//     let temperatura = Math.floor(Math.random() * 4 + 27 );
//     // serverSocket.emit le emite un mensaje a todos
//     serverSocket.emit('nuevaTemperatura', temperatura, new Date().toUTCString())
// }, 3000);







// Llamo a la vista de home.handlebars
// app.get('/', (req,res) => {
//     let nombre = "Juan";
//     res.setHeader('Content-Type', 'text/html');
//     res.status(200).render('home', {
//         nombre:nombre,
//         titulo:'Home Page'
//     });
// })


// const server = app.listen(PORT, () => {
//     console.log(`Server escuchando en puerto ${PORT}`);
// });


















