const socket = io();  // Dejamos a nuestro frontend atento para conectarse a un servidor

const ENTER = 'Enter';
let userEmail = '';
let divMensajes = document.getElementById('mensajes');
let inputMensajes = document.getElementById('mensaje');

inputMensajes.addEventListener('keyup', event => {
    if(event.key === ENTER){
        // Se presiona enter y hay que enviar el mensaje al server
        if(event.target.value.trim() !== ''){
            // El input tiene contenido. Se evita que se envien mensajes vacios
            socket.emit('newMessage', {user:userEmail, message:event.target.value.trim()}); // se envia el mensaje al server
            event.target.value = '';
            inputMensajes.focus();                                                            // enfoca la etiqueta input donde se escriben los mensajes          
        }
    }
})

Swal.fire({
    title:"Bienvenido al chat!",
    input:"email",
    text:"Por favor, ingrese su email",
    inputValidator: (value) => {
        return (!value || !value.includes('@')) && "Debe ingresar un email valido...!!!"
    },
    allowOutsideClick:false
}).then(result => {
    console.log(typeof result.value);
    userEmail = result.value;
    document.title = userEmail; // se coloca al userEmail en la pestaña

    // El usuario nuevo le informa al server que se conecto
    socket.emit('userEmail', userEmail);
    
    // El usuario recibe el historial de mensajes luego de conectarse al server
    socket.on('historialChat', chatHistory => {
        let txt = '';
        chatHistory.forEach(msg => {
            txt += `<p class="mensaje"><strong>${msg.user}</strong>:<i>${msg.message}</i></p><br>`;
        });

        divMensajes.innerHTML = txt;
        divMensajes.scrollTop = divMensajes.scrollHeight;
    });
    
    // Todos los usuarios menos el ultimo (asi lo indico el server) que se conecto,
    // son notificados que un nuevo usuario ingreso al chat
    socket.on('newUserConnectedAlert', userEmail => { 
        Swal.fire({
            text:`${userEmail} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })

    // Se muestra a todos los usuarios en el chat, el nuevo mensaje que fue enviado  
    socket.on('showMessage', message => {
        let txt = '';
        txt += `<p class="mensaje"><strong>${message.user}</strong>:<i>${message.message}</i></p><br>`;

        divMensajes.innerHTML += txt;
        divMensajes.scrollTop = divMensajes.scrollHeight;
    })

    // Todos los usuarios reciben la notificacion que un usuario se desconecto
    socket.on('disconnectedUserAlert', user => {
        Swal.fire({
            text:`${user.userEmail} ha abandonado el chat`,
            toast:true,
            position:"top-right"
        })
    })
})