import express from 'express';
import passport from 'passport';
import { messagesService } from '../services/messages.service.js';
import messagesController from '../controllers/messagesController.js';
import { authorization } from './sessions.router.js';
import { serverSocket } from '../app.js';

export const router = express.Router();

/*----------------*\
    #CHAT ROUTES
\*----------------*/

router.get('/', passport.authenticate('current', {session:false}), authorization('user'), messagesController.renderChat);

let usersList = [];

export const initChat = serverSocketChat => {
    serverSocketChat.on('connection', socket => {
        console.log(`Se ha conectado un cliente con ID ${socket.id} al chat`);
        
        socket.on('userEmail', async userEmail => {
            // Se guardan a los usuarios que se van conectando en un arreglo para saber cuando alguno se retire, quien es  
            usersList.push({
                id: socket.id,
                userEmail: userEmail
            })
            
            let chatHistory = await messagesService.getChat();
            socket.emit('historialChat', chatHistory);                       // server envia el historial de mensajes al nuevo usuario
            
            socket.broadcast.emit('newUserConnectedAlert', userEmail);      // server notifica/emite a todos los usuarios menos al ultimo que se sumo (broadcast.emit), que se sumo un nuevo usuario
        })

        // Server recibe el nuevo mensaje enviado por el cliente
        socket.on('newMessage', message => {
            messagesService.addToChat(message);
            serverSocketChat.emit('showMessage', message);                // server el emite a todos (serverSocketChat) los cliente el mensaje
        })

        // La desconexion ocurre cuando un cliente cerra su ventana o navegador
        socket.on('disconnect',() => {
            let idx = usersList.findIndex(user => user.id === socket.id);
            let user = usersList[idx];
            serverSocketChat.emit('disconnectedUserAlert', user);          // se notifica a todos los usuarios que se retiro un usuario
            usersList = usersList.filter(u => u !== user);
        })
    })
}

