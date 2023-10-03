import crypto from 'crypto';
import { Router} from 'express';
import { usersModel } from '../dao/models/users.model.js';
export const router = Router();

const ADMIN_EMAIL = 'adminCoder@coder.com';
const ADMIN_PASS = 'adminCod3r123';
const rol = { admin: 'admin', user: 'user'};

/*------------------------------*\
    #MIDDLEWARES POST '/signup'
\*------------------------------*/

const emptyFieldsSignUpMid = (req, res, next) => {
    let {first_name, last_name, email, age, password} = req.body;

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).json({status:'error', message:'Todos los campos son obligatorios'});
    }

    next();
}

const registeredEmailMid = async (req, res, next) => { 
    let {email} = req.body;
    let registeredEmail = await usersModel.findOne({email});

    if(registeredEmail) return res.status(400).json({status:'error', message:`El email ${email} ya està registrado`});
    
    next();
}

const emptyFieldsLoginMid = (req, res, next) => {
    let {email, password} = req.body;

    if( !email || !password){
        return res.status(400).json({status:'error', message:'Complete ambos campos para ingresar'});
    }

    next();
}




/*------------------------------*\
        #SESSIONS ROUTES
\*------------------------------*/

router.post('/signup', emptyFieldsSignUpMid, registeredEmailMid, async (req, res) => {
    try {
        // Se recupera la informacion completada por el usuario en el formulario 
        // cuando intenta registrarse y clickea el boton "Registrarme"
        let {first_name, last_name, email, age, password} = req.body;
        
        // Se hashea la contraseña para agregar un factor de seguridad
        password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64'); 

        // Se registra al nuevo usuario
        await usersModel.create({first_name, last_name, email, age, password});

        // Se redirecciona a la pagina de login con el email del usuario creado como parametro 
        res.redirect(`/login?usuarioCreado=${email}`);
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.post('/login', emptyFieldsLoginMid, async (req, res) => {
    // Se recuperan los datos que ingresó el usuario en los inputs email y password
    let {email, password} = req.body;
    let passWithoutHash = password;
    
    // Se hashea la contraseña ingresada por el usuario
    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');

    // ahora que ya esta hasheada la pass, busco al usuario en la db de users
    let user = await usersModel.findOne({email, password});

    if(!user) return res.status(401).send('credenciales incorrectas');
    
    // El usuario esta registrado en la base de datos 'users'

    let rol = rol.user;
    if(user.email === ADMIN_EMAIL && passWithoutHash === ADMIN_PASS) rol = rol.admin;
    
    req.session.user = {
        nombre: user.first_name,
        email: user.email,
        rol: rol
    }

    res.redirect('/profile');
})

router.get('/logout', (req, res) => {
    req.session.destroy(e => console.log(e));

    res.redirect('/login?message=logout correcto!');
})