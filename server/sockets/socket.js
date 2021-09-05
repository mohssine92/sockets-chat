const { io } = require('../server'); // ref al servidor de socket 
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');




const usuarios = new Usuarios();



/* El objeto (cliente) viene con muchos eventos y propiedades es decir no solo emit , broadcast.emit etc ...
 * uno de ellos es id es unico por cada ususario que se connecta a nuestra app , este id generado por el socket.io del parte del cliente (identifica Usuario que acaba de connectar) 
 * este call-back del event del server socket se dispara cuando un cliente se conecta al server socket  
*/
io.on('connection', (client) => {

  
   client.on('entrarChat',(data, callback) => {

    if (!data.nombre || !data.sala ) {// pequeña validacion 
    
      return callback({ 
        error: true,
        mensaje: 'El nombre/ sala es necesario '

      });
  
    } 


    // instruccion para unir ref cliente a una sala en particular
    client.join(data.sala);

    // indentificar a que sala se esta conectando - porque despues  necesitare mandar mensajes a esa sala 
    /* const personas = */ usuarios.agregarPersona(client.id, data.nombre, data.sala)
    

   
    // opcion 1
    // este mismo event lo disparo cuando una persona abndono le chat
    // broadcast.emit : emite a todos clientes conecytados al chat global por defecto  menos  el cliente autor
    // client.broadcast.emit('listaPersonas', usuarios.getPersonas())

    // opcion 2
    // en este caso el cliente conectado a chat de otra sala no le interesa obtener notificaciones de otro cliente conectado a otra sala - le interesa notificarse solo de los clientes 
    // que han sido unido a la misma sala de chat 
    client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
 
    // recordar este callback sera emitido al cliente en especifico quien lanzo el evento - no todos clientes conectados el servidor socket
    //callback(personas) regresa todos personas conectados globlamente 

     callback(usuarios.getPersonasPorSala(data.sala)); // regreso solo las personas conectados a la sala donde estoy cenectado
    
 
   }) 


   client.on('crearMensaje', (data, callback) => {
      // servidor escucha un mensaje enviado por un cliente  conectado al servidor 
      // 

      let persona = usuarios.getPersona(client.id);
      let mensaje = crearMensaje(persona.nombre, data.mensaje);
      // client.broadcast./* to(persona.sala). */emit('crearMensaje', mensaje); // enviar mensaje a todos clientes conectados 
      client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);  // broadcast unicamente a las personas que se encuentran en la misma sala


      
     // callback(mensaje);

   });



   /* problemas : cuando user se reconecta me empuja mas sintancias del mismo en la colecion , tambien quiero cuando un usario pierde conexion con el servidor por cualquier razon 
    * lo elemino de la coleccion de los usuarios conectados (obviamente la logica de usuario la tengo en un objeto controlada)
   */
   client.on('disconnect', () => { // event de la desconeccion 

    
    const personaBorrada = usuarios.borrarPersona(client.id);


    /* cuando una persona se va del chat : pierde conection con el servidor socket : notifico a todas las personas conectadas al chat
       broadcast.emit : emite a todos los clientes conectado al servidor menos al cliente emisor en especifico 
    */ 
    //client.broadcast.emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`)) // tiene listener en el cliente 
    //client.broadcast.emit('listaPersonas', usuarios.getPersonas()) // actualizacion de la coleccion de las personas conectadas al chat 

    // notificar a los clientes unidos a la misma sala de chat del cliente que acaba de desconectarse
    client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
    client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))

   });


   // Mensajes privados
   // cuando alguien quiere mandar mensaje a alguien  - requiere id destinario - gracias al id siempre esta actualziado al connectar usuario nuevamente 
   // data debe contener id del la persona que necesito enviarle mensaje , data.para = id : ver coleccion de personas conectadas al chat  
   client.on('mensajePrivado', data => {
   
     // TODO : validamos que id estinario venga y el mensaje en data

    let persona = usuarios.getPersona(client.id);  
    //client.broadcast./* to(data.para). */emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    client.broadcast.to(data.para).emit('mensajePrivado' , crearMensaje(persona.nombre, data.mensaje) )

   });
  



});


/* 
  TODO : 
  - cuando se conectan otros clientes : es decire nuevas instancia de navigador , debo automaticamenete actualizar arr del cliente anterior o clientes anteriores : fallo video 258 
*/