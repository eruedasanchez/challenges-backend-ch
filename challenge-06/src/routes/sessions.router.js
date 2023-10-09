import passport from 'passport';
import { Router} from 'express';
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
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        message: 'Login OK',
        user: req.user
    });
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

router.post('/signup', passport.authenticate('signup', {failureRedirect:'errorRegistro'}), async (req, res) => {
    try {
        // Se recupera la informacion completada por el usuario en el form de registro
        let { email } = req.body;
        
        // console.log(req.user); //  req.user meustra la info del usuario cuando es creado exitosamente 
        res.redirect(`/login?createdUser=${email}`);
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.get('/errorRegistro', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        error:'Error de registro'
    });
}); 

/*-----------------*\
    #POST /LOGIN
\*-----------------*/

router.post('/login', passport.authenticate('login', {failureRedirect:'errorLogin'}), async (req, res) => {
    try {
        req.session.users = req.user;
        
        res.redirect(`/products?userFirstName=${req.user.first_name}&userLastName=${req.user.last_name}&userEmail=${req.user.email}&userRole=${req.user.rol}`);
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

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