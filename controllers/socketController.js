


const socketController = (socket) => {

    // Cuando un cliente se conecta
    socket.emit( 'test', "ticketControl.ultimo" );
        

    socket.on('prueba', ( payload, callback ) => {
        
        //const siguiente = ticketControl.siguiente();
        //callback( siguiente );
        //socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);

    });

    
}



module.exports = {
    socketController
}

