const socket = io();  // Dejamos a nuestro frontend atento para conectarse a un servidor

const ENTER = 'Enter';
let userEmail = '';
let divMensajes = document.getElementById('mensajes');
let inputMensajes = document.getElementById('mensaje');

inputMensajes.addEventListener('keyup', event => {
    // console.log(evt);
    if(event.key === ENTER){
        // Se presiono enter y hay que enviar el mensaje al server
        if(event.target.value.trim() !== ''){
            // El input tiene contenido. Se evita que se envien mensajes vacios
            socket.emit('nuevoMensaje', {emisor:userEmail, mensaje:event.target.value.trim()}); // envia el mensaje al server
            event.target.value = ''; // borro el contenido del mensaje luego de mandarlo
            inputMensajes.focus(); // enfoca la etiqueta input donde se escriben los mensajes          
        }
    }
})

Swal.fire({
    title:"Bienvenido al chat!",
    input:"text",
    text:"Por favor, ingrese su email",
    inputValidator: (value) => {
        return !value && "Debe ingresar un email...!!!"
    },
    allowOutsideClick:false
}).then(result => {
    userEmail = result.value;
    document.title = userEmail; // coloca al userEmail en la pestaña

    // Se informa al servidor que se conecto un nuevo usuario
    socket.emit('userEmail', userEmail);
    
    // El frontend recibe el evento de bienvenida y los mensajes
    socket.on('bienvenida',mensajes => {
    
        let txt=''
        mensajes.forEach(mensaje => {
            txt += `<p class="mensaje"><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;
        })

        divMensajes.innerHTML = txt;
        // divMensajes.scrollTop=divMensajes.scrollHeight; // permite que siempre se vean los ultimos mensajes cuando se sobrepasa la altura (height) del contendor (pantalla)
    })
})


// Todos los frontend menos el ultimo que se conecto recibe el evento de nuevoUsuario
socket.on('nuevoUsuario', userEmail => {
    Swal.fire({
        text:`${userEmail} se ha conectado...!!!`,
        toast:true,
        position:"top-right"
    })
})

// El frontend recibe el evento de llegada de mensaje y lo muestra
socket.on('llegoMensaje', mensaje => {
    let txt = '';
    txt += `<p class="mensaje"><strong>${mensaje.emisor}</strong>:<i>${mensaje.mensaje}</i></p><br>`;

    divMensajes.innerHTML += txt;
    divMensajes.scrollTop = divMensajes.scrollHeight;
})

socket.on('usuarioDesconectado', usuario => {
    Swal.fire({
        text:`${usuario.userEmail} ha abandonado el chat`,
        toast:true,
        position:"top-right"
    })
})