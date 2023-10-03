import crypto from 'crypto';
import { Router} from 'express';
import { usersModel } from '../dao/models/users.model.js';
export const router = Router();

const ADMIN_ROLE = 'admin';
const USER_ROLE = 'usuario';
const admin = {first_name:'adminCoder', last_name:'House', email: 'adminCoder@coder.com', password: 'adminCod3r123'};

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

    if(registeredEmail) return res.status(400).json({status:'error', message:`El email ${email} ya está registrado`});
    
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
    try {
        // Se recuperan los datos que ingresó el usuario en los inputs email y password
        let {email, password} = req.body;
        let rol = USER_ROLE;

        if(email === admin.email && password === admin.password){
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

        /**** Se logeo un usuario ****/
        
        // Se hashea la contraseña ingresada por el usuario
        password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');

        // Se busca al usuario en la db de users que tenga la password hasheada
        let user = await usersModel.findOne({email, password});

        if(!user) return res.status(401).json({status:'error', message:'Credenciales incorrectas'});;
        
        // El usuario esta registrado en la base de datos 'users'
        req.session.users = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            rol: rol
        }
        
        res.redirect(`/products?userFirstName=${user.first_name}&userLastName=${user.last_name}&userEmail=${user.email}&userRole=${rol}`);
    } catch (error) {
        res.status(500).json({error:'Unexpected error', detail:error.message});
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/login?message=logout correcto!');
})