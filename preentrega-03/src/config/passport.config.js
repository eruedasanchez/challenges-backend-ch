import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github2';
import passportJWT from 'passport-jwt';
import { usersModel } from '../dao/models/users.model.js';
import { generateHash, validateHash } from '../utils.js';
import { config } from './config.js';
import MongoCartManager from '../dao/mongoDB-manager/MongoCartManager.js'; 

const ADMIN_ROLE = 'admin', USER_ROLE = 'user';
const admin = {first_name:'adminCoder', last_name:'House', email: 'adminCoder@coder.com', age: 25, password: 'adminCod3r123'};
const mongoCartManager = new MongoCartManager();

// Extraccion y validacion de token
const searchToken = req => {
    let token = null;

    // Validacion si existe dentro de las cookies una coderCookie
    if(req.cookies.coderCookie) token = req.cookies.coderCookie;
    
    return token;
}

// 1. Configuracion de passport.config incluyendo el serializer y el deserializer de usuario (estoy usando sesiones)

export const initPassport = () => {
    passport.use('signup', new local.Strategy(
        {
            usernameField:'email', passReqToCallback:true
            // Se utiliza usernameField porque por defecto se utiliza userName pero en nuestro caso usamos email como username
            // Con passReqToCallback se pasa la req a la funcion de callback de abajo
        }, 
        async (req, username, password, done) => {
            try {
                let {first_name, last_name, email, age, password} = req.body;
                
                if(!first_name || !last_name || !email || !age || !password){
                    return done(null, false, {message:'Todos los campos son obligatorios'}); // No se produjo un error (null) pero tampoco hay un usuario (false)
                }

                let emailRegistered = await usersModel.findOne({email: username});

                if(emailRegistered) return done(null, false, {message:`El email ${username} ya se encuentra registrado en el sistema`});
                
                // Creacion de un carrito vacío y asignacion al campo cart el ObjectId id_
                const newCart = await mongoCartManager.createCart();
                const cartId = newCart._id;
                
                let user = await usersModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: generateHash(password),
                    role: (email === admin.email && password === admin.password) ? ADMIN_ROLE : USER_ROLE,
                    cart: cartId 
                });
                
                return done(null, user); // Si el usuario fue creado existosamente, se agrega la prop user a la request (req)
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        }, async (username, password, done) => {
            try {
                if(!username || !password) return done(null, false);
                
                /**** Se logeo un usuario ****/
                
                // Se busca al usuario en la db de users que tenga el email ingresado en username
                let user = await usersModel.findOne({email:username});
                
                if(!user || !validateHash(user, password)){
                    // No se encontro el usuario o la clave es invalida
                    return done(null, false, {message:'Credenciales incorrectas'});
                } 

                // user = {
                //     first_name: user.first_name,
                //     last_name: user.last_name,
                //     email: user.email,
                //     _id: user._id,
                //     role: user.role,
                //     cart: user.cart
                // };

                // aca tendria que pasar solo el user para despues aplicar el DTO (user a secas esta bien pasado asi)
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ))
    
    passport.use('github', new github.Strategy(
        {
            // Descomentar los datos que se encuentran debajo
            
            clientID: 'Iv1.f39cdb52aec8edcb',
            clientSecret: '601b9221a2029df1b4a7a270c1cd8f21396888bc',
            callbackURL: 'http://localhost:8080/api/sessions/callbackGithub'
        },
        async (token, tokenRefresh, profile, done) => {
            try {
                let rol = USER_ROLE;
                let user = await usersModel.findOne({email:profile._json.email});  
                
                if(!user){
                    user = await usersModel.create({
                        first_name: profile._json.name,
                        email: profile._json.email,
                        rol: USER_ROLE   //corregir el rol para que se muestre (ahora esta undefined)
                    })
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ))
    
    passport.use('current', new passportJWT.Strategy(
        {
            jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([searchToken]), // searchToken permite obtener el token
            secretOrKey: config.SECRET
        },
        (jwtContent, done) => {
            try {
                return done(null, jwtContent.user) // jwtContent porque en la funcion generateJWT el 1er parametro en jwt.sign es {user}
            } catch (error) {
                return done(error);
            }
        }
    ))
    
    // Configuracion serializer y deserializer (requerido porque se utilizan sessions) 
    // passport.serializeUser((user, done) => {
    //     return done(null, user._id); // Se envia la prop _id para recuperar la info del usuario
    // })

    // passport.deserializeUser(async (id, done) => {
    //     let user = await usersModel.findById(id);
    //     return done(null, user); 
    // })
} // fin initPassport

