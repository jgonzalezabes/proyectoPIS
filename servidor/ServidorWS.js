function ServidorWS(){

	//enviar peticiones
	this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	}
	this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}
	this.enviarATodos=function(socket,mens,datos){
    	socket.broadcast.emit(mens,datos);
    }



	//gestionar peticiones
	this.lanzarServidorWS=function(io,juego){
		let cli=this;
		io.on('connection', (socket) => {
		  console.log('Usuario conectado');

		  socket.on("crearPartida",function(nick){
		  	let res = juego.jugadorCreaPartida(nick);
		  	let codigoStr=res.codigo.toString(); //en crearPartida sería let codigoStr=res.codigo.toString();
			socket.join(codigoStr);
		  	cli.enviarAlRemitente(socket,"partidaCreada", res);
		  	let lista=juego.obtenerPartidasDisponibles();
		  	cli.enviarATodos(socket,"actualizarListaPartidas",lista)
		  });

		  socket.on("unirseAPartida",function(nick, codigo){
		  	let res = juego.jugadorSeUneAPartida(nick, codigo);
		  	let codigoStr=codigo.toString(); //en crearPartida sería let codigoStr=res.codigo.toString();
			socket.join(codigoStr);
			cli.enviarAlRemitente(socket,"unionAPartida", res);
		  	//comprobar que la partida puede comenzar (fase jugando de la partida)
		  	let partida=juego.obtenerPartida(codigo);
		  	if (partida.esJugando()){
		  		cli.enviarATodosEnPartida(io,codigo,"aJugar",{});
		  	}
		  });
		 /* socket.on("abandonarPartida",function(){
		  	juego.juegoAbandona(nick,codigo);
		  	cli.enviarATodosEnPartida(io,codigo,"jugadorAbandona",{
		  		//socket.leave(codigo.toString());
		  	});
		  });*/
		  //socket.on("aJugar",function(){

		  //})
		});
	}
}

module.exports.ServidorWS=ServidorWS;