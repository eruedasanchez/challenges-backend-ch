// 1. configurar el passport.config incluyendo el serializer y el deserializer de usuario

import passport from 'passport';
import local from 'passport-local';

// como tambien que realizar valodaciones importo lo siguiete
import crypto from 'crypto';
import { usersModel } from '../dao/models/users.model.js';
import { generaHash, validaHash } from '../utils.js';

// 1. configurar el passport.config incluyendo el serializer y el deserializer de usuario

export const inicializaPassport = () => {
    passport.use('registro', new local.Strategy(
        {
            usernameField:'email', passReqToCallback:true
            // usernameField lo utilizo porque por defecto es userName pero nosotros usamos email como isername
            // passReqToCallback pasamos la req a la func de callback de abajo
        }, 
        async (req, userName, password, done) => {
            try {
                // logica de registro (la buscamos en nuestro session router)
                let {first_name, last_name, email, age, password} = req.body;

                if(!first_name || !last_name || !email || !age || !password){
                    done(null, false); // no se dio error (null) pero tampoco al usuario (false)

                }

                let existe = await usersModel.findOne({email: email});

                if(existe){
                    done(null, false);
                }
                
                // password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64'); 
                
                // Se registra al nuevo usuario
                let usuario = await usersModel.create({
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: generaHash(password)});

                done(null, usuario); // aca se agrega la propiedad user a la request (req)
            } catch (error) {
                // unico lugar donde done ejecuta con su primer argumento
                done(error);
            }
        }
    ))

    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
            // , passReqToCallback:true

        }, async (username, password, done) => {
            try {
                if(!username || !password) return done(null, false);
                // return res.redirect('/login?error=Faltan datos');

                /**** Se logeo un usuario ****/
        
                // Se hashea la contraseña ingresada por el usuario
                // password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');


                // Se busca al usuario en la db de users que tenga la password hasheada
                // let user = await usersModel.findOne({email:username, password:password});

                let user = await usersModel.findOne({email:username});
                

                if(!user){
                    return done(null, false);
                } else {
                    if(!validaHash(user, password)){
                        return done(null, false);
                    }
                } 
                // return res.redirect('/login?error=Credenciales incorrectas');

                user = {
                    email: user.email,
                    _id: user._id
                };

                return done(null, user); // devuelve el usuario
            } catch (error) {
                return done(error);
            }
        }
    ))

    // configuracion de serializer y deserializer porque usamos sessions
    passport.serializeUser((user, done) => {
        done(null, user._id); // envio la prop _id para recuperar la info del usuario
    })

    passport.deserializeUser(async (id, done) => {
        let usuario = await usersModel.findById(id);
        done(null, usuario); 
    })

} // fin de inicializaPassport
