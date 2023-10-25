import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github2';
import passportJWT from 'passport-jwt';
import { usersModel } from '../dao/models/users.model.js';
import {PRIVATE_KEY, generateHash, validateHash } from '../utils.js';  
// import { config } from './config.js';

const ADMIN_ROLE = 'admin';
const USER_ROLE = 'usuario';
const admin = {first_name:'adminCoder', last_name:'House', email: 'adminCoder@coder.com', password: 'adminCod3r123'};

// definicion estrategia de extraccion de cookies


// (DESCOMENTAR. ES PARTE DE LA FUNCION PARA VALIDAR EL TOKEN)
// const searchToken = req => {
//     let token = null;

//     if(req.cookies.coderCookie){
//         console.log("Recupero token, ahora desde una cookie y con passport")
//         token = req.cookies.coderCookie
//     }
    
//     return token;
// }


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
                
                let user = await usersModel.create({ 
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password:generateHash(password) 
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
                let rol = USER_ROLE;

                if(username === admin.email && password === admin.password){
                    /**** Se logeo el admin ****/
                    rol = ADMIN_ROLE;

                    req.session.users = {
                        first_name: admin.first_name,
                        last_name: admin.last_name,
                        email: admin.email,
                        rol: rol
                    }

                    res.redirect(`/products?userFirstName=${admin.first_name}&userLastName=${admin.last_name}&userEmail=${admin.email}&userRole=${rol}`);
                    return;
                }

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
                //     rol: rol
                // };

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
    
    // passport.use('jwt', new passportJWT.Strategy(
    //     {
    //         // envio las parametrizaciones
    //         jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([searchToken]), // de donde voy a extraer el jwt y como? con la funcion searchToken
    //         secretOrKey: PRIVATE_KEy
                // secretOrKey: config.SECRET
    //     },
    //     (contenidoJwt, done) => {
    //         try {
    //                 if(contenidoJwt.user.nombre === 'Juan'){
    //                     // en el caso que intente ingresar un usuario llamado Juan
    //                     return done(null, false, {messages:'El usuario Juan esta temporalmente inhabilitado', detalle:'Contactee a RRHH'})
    //                 }
    //             return done(null, contenidoJwt.user) // se coloca contenidoJwt.user porque cuando creo la funcion generateJWT en jwt.sign el 1er parametro es {user}
    //         } catch (error) {
    //             return done(error);
                
    //         }

    //     }
    // ))

    // control interno de mensajes y sistema de roles con passport
    
    // por ejemplo, cuando modifico el token o cuando lo borro en la consola
    // me arroja el mismo error "unauthorized" y tal vez quiero que se muestre
    // alguna informacion adicional aunque no sea lo ideal (recordar que siempre 
    // quiero evitar ser claro en los errores para evitar que los posibles atacantes sepan por 
    // donde atacar)


    // Configuracion serializer y deserializer (requerido porque se utilizan sessions) 
    passport.serializeUser((user, done) => {
        return done(null, user._id); // Se envia la prop _id para recuperar la info del usuario
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id);
        return done(null, user); 
    })
} // fin initPassport

