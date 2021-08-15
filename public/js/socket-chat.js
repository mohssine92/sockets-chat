var socket = io(); // Ref  al cliente 


var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') /* || !params.has('sala') */ ) {
     window.location = 'index.html';
     throw new Error('El nombre y sala son necesarios'); // throw hace effect return
}

var usuario = {
    nombre: params.get('nombre'),
   /*  sala: params.get('sala') */
};




/* este listener se dispara a Listner connection dfel server socket
 * en callbak de este listener si se conecta con exito al server de sicket dispatamos algo 
 */
socket.on('connect', function() {

 //decir al servidor de socket quien soy yo -custom event - custom event - payload - callback : respuesta del servidor : atrave de la ejecuccion de callback:funcion
 socket.emit('entrarChat', usuario , (resp) => {
   console.log('Usuarios conectados ', resp )
   
 })

});




// escuchar
socket.on('disconnect', function() {
   console.log('Perdimos conexión con el servidor');
});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp );
});


// Listenr . cliente desconectado de la coelccion del chat 
socket.on('crearMensaje',(mensaje) => { 
 
  console.log('Servidor:', mensaje);

});


// mantener los usuarios actualizados de la lista de los usuarios conectados al chat
socket.on('listaPersonas',(personas) => {   
 
  console.log(personas);

});

