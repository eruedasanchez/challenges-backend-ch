import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

export const PRIVATE_KEY = 'secretPass';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validateHash = (user, password) => bcrypt.compareSync(password, user.password);

// bcrypt.genSaltSync(10) o saltos son serie de caracteres aleatorios que 
// se le agregan a la password para evitar los ataques de fuerza bruta
// 10 son los ciclos o saltos que se van agregando

// compareSync(password, user.password) compara la data 
// sin codificar (password) con la data encryptada (user.password)

// Funcion generadora de token para el usuario
// export const generateJWT = user => jwt.sign({user}, PRIVATE_KEY, {expiresIn: '1h'});
// export const generateJWT = user => jwt.sign({user}, config.SECRET, {expiresIn: '1h'});

// Funcion para que el server valide el token enviado por el usuario
// export const validateJWT = (req, res, next) => {
//     // Bearer token authorization
//     // Tenemos que ver si existe y recuperar el header authorization
//     // Si existe, tomar el Bearer token, quedarnos con el token y pasarlo por una 
//     // funcion de validacion del objeto jwt y sino arrojamos error

//     // let authHeader = req.headers.authorization

//     // if(!authHeader) return res.status(401).json({error:"No existe token"});

//     // // Llega el header
//     // let token = authHeader.split(' ')[1]; // porque authHeader devuelve un array de tipo ['Bearer', 'token']

    
    
//     // Codigo al utilizar cookie parser (siempre hay que loguearse) 

//     if(!req.cookies.coderCookie){
//         return res.status(401).json({error:"No existe token"});
//     }

//     console.log("Recupero token, ahora desde una cookie")
//     let token = req.cookies.coderCookie


//     jwt.verify(token, PRIVATE_KEY, (error, credenciales) => {
//         if(error) return res.status(401).json({error:"Token invalido"});

//         console.log("credenciales", credenciales);

//         req.user = credenciales.usuario;

//         next();
//     })
// } fin validateJWT 

