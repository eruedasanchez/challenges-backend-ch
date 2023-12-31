import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Router} from 'express';
import { config } from '../config/config.js';
import { usersModel } from '../dao/models/users.model.js';
import { generateHash, validateHash, userRole } from '../utils.js';
export const router = Router();

/*------------------------------------*\
    #FUNCTIONS RESET PASSWORD
\*------------------------------------*/

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

/*------------------------------------*\
    #MIDDLEWARES PUT '/premium/:uid'
\*------------------------------------*/

// 1. Formato invalido del UserId 
const invalidUserIdMid = async (req, res, next) => {
    try {
        let userId = req.params.uid;

        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw new Error('El uid ingresado tiene un formato invalido');
        }
        next();
    } catch (error) {
        req.logger.error(`Error al ingresar al middleware de invalidUserId. Detail: ${error.message}`);
        return res.status(500).json({error:'Unexpected', detail:error.message});
    }
}

// 2. Usuario inexistente en la DB 
const nonExistentUserIdMid = async (req, res, next) => {
    try {
        let userId = req.params.uid;

        let user = await usersModel.findOne({_id:userId});
        
        if(!user){
            throw new Error('El uid ingresado no corresponde a un usuario registrado');
        }
        next();
    } catch (error) {
        req.logger.error(`Error al ingresar al middleware de nonExistentUserId. Detail: ${error.message}`);
        return res.status(500).json({error:'Unexpected', detail:error.message});
    }
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
    console.log("user", user);
    console.log("typo user", typeof user);
            
    if(!user){
        // El email ingresado no corresponde a un usuario registrado
        return res.redirect('/resetPassword?unregisteredEmail=El email ingresado no corresponde a un cliente registrado');
    }

    // El email ingresado se encuentra registrado en la DB
    let jwtoken = jwt.sign({user}, config.SECRET, {expiresIn: '1h'}); 
    await sendEmail(jwtoken, user.email);
    
    return res.redirect(`/resetPassword?successResetRequest=Solicitud de reestablecimiento exitosa. Enviamos un mail a ${requestedEmail} para que continue con el proceso de reestablecemiento`);
});

/*--------------------------*\
    #POST /CONFIRMPASSWORD
\*--------------------------*/

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

/*----------------------*\
    #PUT /PREMIUM/:UID
\*----------------------*/

router.put('/premium/:uid', invalidUserIdMid, nonExistentUserIdMid, async (req, res) => {
    try {
        let userId = req.params.uid;

        let user = await usersModel.findOne({_id:userId});

        if(user.role === userRole.ADMIN){
            throw new Error('No posee los permisos para cambiar el rol de uid ingresado');
        }
        
        // Luego de pasar por el middleware de admin, solo puede tener el rol 'user' o 'premium'
        user.role === userRole.PREMIUM ? user.role = userRole.USER : user.role = userRole.PREMIUM;
        
        await user.save();
        return res.status(200).json({status: 'ok', updatedRoleUser: user});
    } catch (error) {
        req.logger.fatal(`Error al modificar el rol del usuario. Detalle: ${error.message}`);
        return res.status(500).json({error:'Unexpected', detalle:error.message});
    }
});

