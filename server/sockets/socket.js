const { io } = require('../server'); // ref al servidor de socket 
const { Usuarios } = require('../classes/usuarios');




const usuarios = new Usuarios();



/* El objeto (cliente) viene con muchos eventos y propiedades es decir no solo emit , broadcast.emit etc ...
 * uno de ellos es id es unico por cada ususario que se connecta a nuestra app , este id generado por el socket.io del parte del cliente (identifica Usuario que acaba de connectar) 
 * este call-back del event del server socket se dispara cuando un cliente se conecta al server socket  
*/
io.on('connection', (client) => {

  
   client.on('entrarChat',(data, callback) => {

    if (!data.nombre/*  || !data.sala */) {
    
      return callback({ // resp del servdidor al event por parte del cliente 
        error: true,
        mensaje: 'El nombre es necesario '

      });
  
    }

    const personas = usuarios.agregarPersona(client.id, data.nombre)

  
    // todas personas que estan conectadas escuchen la notificacion del array de las personas conectadas al chat 
    // este mismo event lo disparo cuando una persona abndono le chat
    // broadcast.emit : emite a todos clientes menos  el cliente autor
    client.broadcast.emit('listaPersonas', usuarios.getPersonas())


    // me va interesar returnar en callback al cliente array de las personas conectados al chat  
    // recordar este callback sera emitido al cliente en especifico quien lanzo el evnto - no todos clientes conectados el servidor socket
    callback(personas)
    
 
   }) 
   
   
   /* problemas : cuando user se reconecta me empuja mas sintancias del mismo en la colecion , tambien quiero cuando un usario pierde conexion con el servidor por cualquier razon 
    * lo elemino de la coleccion de los usuarios conectados (obviamente la logica de usuario la tengo en un objeto controlada)
   */
   client.on('disconnect', () => { // event de la desconeccion 

    
    const personaBorrada = usuarios.borrarPersona(client.id);


    /* cuando una persona se va del chat : pierde conection con el servidor socket : notifico a todas las personas conectadas al chat
       broadcast.emit : emite a todos los clientes conectado al servidor menos al cliente emisor en especifico 
    */ 
    client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje : `${ personaBorrada.nombre } salió`}) // tiene listener en el cliente 
    client.broadcast.emit('listaPersonas', usuarios.getPersonas()) // actualizacion de la coleccion de las personas conectadas al chat 


       //client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
    //client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));


   });
  












  


});


/* 
  TODO : 
  - cuando se conectan otros clientes : es decire nuevas instancia de navigador , debo automaticamenete actualizar arr del cliente anterior o clientes anteriores : fallo video 258 
*/