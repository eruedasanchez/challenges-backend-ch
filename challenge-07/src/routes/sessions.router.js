import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Router} from 'express';
import { config } from '../config/config.js';
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
    passport.authenticate('signup', async function(err, user, info, status) {
        if (err) return next(err);
        
        if (!user) {
            return res.redirect(`/signup?error=${info.message ? info.message : info.toString()}`);
        }
        
        req.user = user;
        return next();      // pasa la ejecucion a la funcion de abajo
    })(req, res, next);
}, (req, res) => {
    res.status(200).redirect(`/login?createdUser=Usuario:${req.user.first_name} registrado correctamente. Username:${req.user.email}`);
});

/*-----------------*\
    #POST /LOGIN
\*-----------------*/

router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info, status) {
        if (err) return next(err);
        
        if (!user) return res.redirect(`/login?error=${info.message ? info.message : info.toString()}`);
        
        req.user = user;
        return next(); // para poder ejecutar lo que quiera debajo
    })(req, res, next);
}, (req, res) => {
    let user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart
    };

    // Generacion de la cookie luego de logearme. Hay que generar el token
    let token = jwt.sign({user}, config.SECRET, {expiresIn: '1h'});
    
    // Aplico la utilizacion de cookie parser. Se almacena el token en la cookie coderCookie
    res.cookie('coderCookie', token, {
        maxAge: 1000 * 60 * 60, // 1hs de duracion
        httpOnly: true          // se tilda la opcion httpOnly, es decir, que al ejecutar document.cookie no las deja acceder 
    })
    
    res.redirect(`/products?userFirstName=${req.user.first_name}&userLastName=${req.user.last_name}&userEmail=${req.user.email}&userRole=${req.user.role}&cartId=${req.user.cart}`);
});

/*-------------------*\
    #POST /LOGOUT
\*-------------------*/

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/login?message=logout correcto!');
})