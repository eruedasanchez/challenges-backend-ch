const socket = io();  // dejamos a nuestro frontend atento para conectarse a un servidor
// console.log(socket);

let nombre = prompt("Ingrese su nombre");

// Con socket.on, el frontend escucha el evento con id bienvenida
socket.on("bienvenida", data => {
    console.log(data.message);
    // Ahora voy a enviar el nombre con la identificacion que me solicitan 
    socket.emit("identificacion", nombre);
})

socket.on("idCorrecto", data => {
    console.log(data.message);
})

socket.on('nuevoUsuario', nombre => {
    console.log(`${nombre} se ha unido al server`);
})

socket.on('nuevaTemperatura', (temperatura, fecha) => {
    console.log(`${fecha}: temperatura asciende a ${temperatura}º`);
    let pTemperatura = document.getElementById('temperatura');
    pTemperatura.innerHTML = `La temperatura es de ${temperatura}º`;
})

socket.on('nuevoPersonaje', (personaje, personajes) => {
    console.log(`Se ha dado de altra a ${personaje.name}`);

    let ul = '';
    personajes.forEach(personaje => {
        ul += `<li>${personaje.name}</li>`;
    });
        
    let ulDemon = document.getElementById('demon');
    ulDemon.innerHTML = ul;
})

const cargaPersonajes = () => {
    fetch('/demon')
    .then(data => {
        return data.json()
    })
    .then(personajes => {
        let ul = '';
        personajes.forEach(personaje => {
            ul += `<li>${personaje.name}</li>`;
        });
        
        let ulDemon = document.getElementById('demon');
        ulDemon.innerHTML = ul;
    })
}

cargaPersonajes();