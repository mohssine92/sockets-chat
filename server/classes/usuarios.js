// {
//     id: 'ALkjdaklsdj-asdkj', // va ser id que nos genera socket.io
//     nombre: 'Fernando',
// }



class Usuarios {

    constructor() {
        this.personas = []; // inicializar arreglo de personas que estan conectadas al chat 
    }

    agregarPersona( id, nombre, sala ) {
      /* agragar una persona al chat  */

        let persona = { id, nombre , sala }; // crear object de persona

        this.personas.push(persona); // agregar object persona al arreglo de persona conectdas al chat

        return this.personas; // return todas las personas que estan en el chat  - puedo regresar solo persona - depende de lo que quiero hacer

    }

    getPersona(id) {
        /* obtener una persona en particular por el id 
         * buscar en arrglo de personas si algun objeto coincide con este id 
         * funcion filter siempre regresa un areglo , yo quiero solo primer posicion del arreglo 
         * si no encuentra ningun persona por id esto va ser undefined o null 
        */
        let persona = this.personas.filter( persona => persona.id === id )[0]; // un = es asignacion , === es comparacion

        return persona;
    } // esta instruccion regresa todos los que estan conectados al chat global por defect de configuracion de socket server

    getPersonas() { // obtener todas personas conectados al chat 
        return this.personas;
    }

    getPersonasPorSala(sala) {
        
      let personasEnSala = this.personas.filter(persona => persona.sala === sala);
      return personasEnSala;

    } // esta instruccion me regresa solo los que estan unidos , conectados a una sala de chat 

    borrarPersona(id) {
     /* eliminar Object persona de mi arreglo de personas conectadas al chat : suponiendo que dicho user se desconecta del chat cualquier razon que una persona abandona el chat   
        entonces yo necesito poder moverlo  
        -- podia mandar una notificacion al usuario diciendo que se borro .. 
      */

      let personaBorrada = this.getPersona(id);  // tengo objecto de persona la que voy a borrar  

      this.personas = this.personas.filter(persona => persona.id != id); // regresa arreglo de persona que cumplan la condicion , asi la del id sera ignorada en el nuevo array

      return personaBorrada;  // esto me sirve para decir que persona desconectada - abandono chat - se fue

    }


}
/* Manejar los ususarios que se connectan a la aplicacion 
 * voy a necesitar varios metodos para poder trabajar con estas personas conectadas al chat
 * class usuarios que se va encargar de todos ususarios conectados 
*/





module.exports = { // exporto la classe para poder utulizarla en otros archivos
    Usuarios
}