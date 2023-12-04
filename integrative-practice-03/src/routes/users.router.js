import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Router} from 'express';
import { config } from '../config/config.js';
import { usersModel } from '../dao/models/users.model.js';
import { generateHash, validateHash } from '../utils.js';
export const router = Router();

const transporter = nodemailer.createTransport({
    service: config.NODEMAILER_SERVICE,
    port: config.NODEMAILER_PORT,
    auth: {
        user: config.TRANSPORT_USER,
        pass: config.TRANSPORT_PASS
    }
})

const sendEmail = async (jwtoken, to)  => {
    return transporter.sendMail({
        from: 'Ezequiel <ezequiel.ruedasanchez@gmail.com>',
        to: to,
        subject: 'Reset Password',
        html: `
        <h2>Solicitud de reestablecimeinto de contraseña</h2>
        <p>Para continuar con el proceso, haga click en el siguiente link:</p>
        <a style="color:white; background-color:blue" href="http://localhost:8080/confirmNewPassword?token=${jwtoken}">Reestablecer contraseña</a>
        <br>
        <br>
        <p>En caso de no haber realizado la solicitud, desestime este mensaje</p>
        `,
    });
}

/*------------------------*\
    #POST /RESETPASSWORD
\*------------------------*/

router.post('/resetPassword', async (req, res, next) => {

    let requestedEmail = req.body.email;

    if(!requestedEmail) return res.redirect('/resetPassword?error=Ingrese un email válido');
    
    /**** Se completó el campo con un email ****/
    
    // Se busca al usuario en la DB que coincida con el email ingresado 
    let user = await usersModel.findOne({email:requestedEmail});
            
    if(!user){
        // El email ingresado no corresponde a un usuario registrado
        return res.redirect('/resetPassword?unregisteredEmail=El email ingresado no corresponde a un cliente registrado');
    }

    // El email ingresado se encuentra registrado en la DB
    let jwtoken = jwt.sign({user}, config.SECRET, {expiresIn: '3m'}); 
    // let jwtoken = jwt.sign({user}, config.SECRET, {expiresIn: '1h'}); // Generación del JWT para cumplir el paso de expiración
    await sendEmail(jwtoken, user.email);
    
    return res.redirect(`/resetPassword?successResetRequest=Solicitud de reestablecimiento exitosa. Enviamos un mail a ${requestedEmail} para que continue con el proceso de reestablecemiento`);
});

router.post('/confirmPassword', async (req, res) => {
    try {
        let {password, email} = req.body;
        
        // Se busca al usuario en la DB que coincida con el email ingresado 
        let user = await usersModel.findOne({email:email});
        
        if(validateHash(user, password)){
            return res.redirect('/resetPassword?samePassword=La contraseña ingresada es igual a la actual. Por favor, realice una nueva solicitud.');
        }
        
        // Modificación de la contaseña en la DB
        user.password = generateHash(password);
        await user.save();
        
        return res.redirect('/login?successNewPassword=La contraseña ha sido reestablecida con éxito');
    } catch (error) {
        console.error("Error al guardar la contraseña:", error);
        return res.redirect('/confirmNewPassword?error=Error al reestablecer la contraseña');
    }
});

