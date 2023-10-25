import passport from 'passport';
import { Router} from 'express';
import { generateJWT} from '../utils.js';
import jwt from 'jsonwebtoken';
export const router = Router();

/*------------------------------*\
        #SESSIONS ROUTES
\*------------------------------*/

// 3. Carga del middleware de passport 

/*------------------------*\
    #CONNECT WITH GITHUB
\*------------------------*/

router.get('/github', passport.authenticate('github',{}), (req, res) => {})

router.get('/callbackGithub', passport.authenticate('github', {failureRedirect:'errorGithub'}), (req, res) => {
    try {
        req.session.users = req.user;
        res.redirect(`/products?userFirstName=${req.user.first_name}&userEmail=${req.user.email}&userRole=${req.user.rol}`);
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.get('/errorGithub', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        error:'Error en Github'
    });
})

/*-----------------*\
    #POST /SIGNUP
\*-----------------*/

router.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function(err, user, info, status) {
        if (err){
            // console.log("error", err);
            return next(err);
        }  
        
        if (!user) {
            // console.log("infomsg", info.message);
            // console.log("infoTstring", info); 
            return res.redirect(`/signup?error=${info.message ? info.message : info.toString()}`);
        }
        
        req.user = user;
        return next();      // pasa la ejecucion a la funcion de abajo
    })(req, res, next);
}, (req, res) => {
    res.status(200).redirect(`/login?createdUser=Usuario:${req.user.first_name} registrado correctamente. Username:${req.user.email}`);
});

// router.get('/errorRegistro', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.status(200).json({
//         error:'Error de registro'
//     });
// }); 

/*-----------------*\
    #POST /LOGIN
\*-----------------*/

router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info, status) {
        if (err) return next(err)

        // if(username === admin.email && password === admin.password){
        //     /**** Se logeo el admin ****/
        //     let role = ADMIN_ROLE;

        //     // req.session.users = {
        //     //     first_name: admin.first_name,
        //     //     last_name: admin.last_name,
        //     //     email: admin.email,
        //     //     rol: rol
        //     // }

        //     res.redirect(`/products?userFirstName=${admin.first_name}&userLastName=${admin.last_name}&userEmail=${admin.email}&userRole=${role}`);
        //     return;
        // }
        
        if (!user) { 
            return res.redirect(`/login?error=${info.message ? info.message : info.toString()}`)
        }
        
        req.user = user;
        return next(); // para poder ejecutar lo que quiera debajo
    })(req, res, next);
}, (req, res) => {

    // ANTES HABRIA QUE LIMPIAR DATOS DEL USER COMO por ejemplo, crear un obj con {nombre: req.user.nombre, rol: req.user.rol, etc}
    // let token = generateJwt(user);

        // Aplico la utilizacion de cookie parser
        // res.cookie('coderCookie', token, {
        //     maxAge: 1000 * 60 * 60, // 1hs de duracion
        //     httpOnly: true // al crearse la cookie se tilda la opcion httpOnly pero al intentar ejecutar document.cookie, no me la muestra
        // })

        // return res.status(200).json({
        //     usuarioLogueado: user,
        //     token
        // })

        // Entonces, al ejecutar el post './login', obtengo ademas de la 
        // info del usuario, el token generado por la funcion generateJwt
        res.redirect(`/products?userFirstName=${req.user.first_name}&userLastName=${req.user.last_name}&userEmail=${req.user.email}&userRole=${req.user.role}`);
        // res.status(200).redirect(`/perfil?mensaje= Usuario:${req.user.first_name} logeado correctamente. Rol:${req.user.role}`);
});

// Ahora vamos a suponer que nuestra pagina de perfil es la que tenemos que plantear de products (lo vamos a hacer en el views router)

// version anterior 

// router.post('/login', passport.authenticate('login', {failureRedirect:'errorLogin'}), async (req, res) => {
//     try {
//         req.session.users = req.user;

        // let token = generateJwt(user);

        // Aplico la utilizacion de cookie parser
        // res.cookie('coderCookie', token, {
        //     maxAge: 1000 * 60 * 60, // 1hs de duracion
        //     httpOnly: true // al crearse la cookie se tilda la opcion httpOnly pero al intentar ejecutar document.cookie, no me la muestra
        // })

        // return res.status(200).json({
        //     usuarioLogueado: user,
        //     token
        // })

        // Entonces, al ejecutar el post './login', obtengo ademas de la 
        // info del usuario, el token generado por la funcion generateJwt
        
//         res.redirect(`/products?userFirstName=${req.user.first_name}&userLastName=${req.user.last_name}&userEmail=${req.user.email}&userRole=${req.user.rol}`);
//     } catch (error) {
//         res.status(500).json({error:'Unexpected error', detail:error.message});
//     }
// })

router.get('/errorLogin', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        error:'Error Login'
    });
}); 

/*-------------------*\
    #POST /LOGOUT
\*-------------------*/

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/login?message=logout correcto!');
})