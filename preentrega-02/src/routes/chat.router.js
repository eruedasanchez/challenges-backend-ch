import express from 'express';
import MongoChatManager from '../dao/mongoDB-manager/MongoChatManager.js';
import { serverSocket } from '../app.js';
export const router = express.Router();

const mongoChatManager = new MongoChatManager();

/*------------------------------*\
        #CHAT ROUTES
\*------------------------------*/

router.get('/', (req, res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat', { header: 'Inicio | Chat' });
});

export const initChat = (serverSocketChat) => {
    serverSocketChat.on('connection', socket => {
        console.log(`Se ha conectado un cliente con ID ${socket.id} al chat`);
        let usersList = [];
        
        socket.on('userEmail', async userEmail => {
            // Se guardan a los usuarios que se van conectando en un arreglo para saber cuando alguno se retire, quien es  
            usersList.push({
                id: socket.id,
                userEmail: userEmail
            })
            
            let chatHistory = await mongoChatManager.getChat();
            socket.emit('historialChat', chatHistory);                       // server envia el historial de mensajes al nuevo usuario
            
            socket.broadcast.emit('newUserConnectedAlert', userEmail);      // server notifica/emite a todos los usuarios menos al ultimo que se sumo (broadcast.emit), que se sumo un nuevo usuario
        })

        // Server recibe el nuevo mensaje enviado por el cliente
        socket.on('newMessage', message => {
            mongoChatManager.addToChat(message);                           // se agrega el mensaje a MongoDB 
            serverSocketChat.emit('showMessage', message);                // server el emite a todos (serverSocketChat) los cliente el mensaje
        })

        // La desconexion ocurre cuando un cliente cerra su ventana o navegador
        socket.on('disconnect',() => {
            console.log(`se desconecto del chat el cliente con id ${socket.id}`);
            
            let idx = usersList.findIndex(user => user.id === socket.id);
            let user = usersList[idx];
            serverSocketChat.emit('disconnectedUserAlert', user);          // se notifica a todos los usuarios que se retiro un usuario
            usersList.splice(idx, 1);
        })
    })
}

