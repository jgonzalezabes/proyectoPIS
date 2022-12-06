function ServidorWS(){

	//enviar peticiones
	this.enviarAlRemitente=function(socket,mensaje,datos){ //a la persona que le ha enviado un socket al servidor
		socket.emit(mensaje,datos);
	}
	this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}
	this.enviarAlRestoPartida=function(socket,codigo,mensaje,datos){
    socket.broadcast.to(codigo).emit(mensaje,datos)
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
		  	//cli.enviarATodosEnPartida(io,codigo,"aColocar",{});
              if (partida.esDesplegando()){
                  let us =juego.obtenerUsuario(nick);
                  let flota=us.obtenerFlota();
                  let res={};
                  res.flota=flota;      
                  cli.enviarATodosEnPartida(io,codigoStr,"faseDesplegando",res);
              }
		  });
		  socket.on("abandonarPartida",function(nick, codigo){ 
		  	let codigoStr=codigo.toString();//también debemos mostrar un modal al otro jugador diciéndole que el jugador "nick" ha abandonado la partida y elminar la partida
		  	juego.jugadorAbandona(nick,codigo);
		  	cli.enviarATodosEnPartida(io,codigoStr,"jugadorAbandona",nick);
		  });
		  socket.on("salir",function(nick, codigo){ //también debemos mostrar un modal al otro jugador diciéndole que el jugador "nick" ha abandonado la partida y elminar la partida
		  	let codigoStr=codigo.toString();
		  	console.log("servidor salir");
		  	juego.jugadorAbandona(nick,codigo);
		  	let usr =juego.obtenerUsuario(nick)
		  	console.log(usr.partida.fase);
		  	cli.enviarAlRestoPartida(socket,codigoStr,"jugadorAbandona",nick);
		  });
		  socket.on("colocarBarco",function(nick,nombre,x,y){
		  	let us = juego.obtenerUsuario(nick);
		  	if(us){
		  		us.colocarBarco(nombre,x,y);
		  		barco=us.obtenerEstado(x,y);
		  		cli.enviarAlRemitente(socket,"barcoColocado", barco);
		  	}
		  });
		  socket.on("barcosDesplegados",function(nick){
		  	let us = juego.obtenerUsuario(nick);
		  	if(us){
		  		us.barcosDesplegados();
		  		if(us.partida.esJugando()){
		  			let codigo=us.partida.codigo.toString();
		  			cli.enviarATodosEnPartida(io,codigo,"aJugar",{});
		  		}
		  	}
		  });
		  socket.on("disparar",function(nick,x,y){
		  	let us = juego.obtenerUsuario(nick);
		  	if(us){
		  		let codigo=us.partida.codigo.toString();
		  		let rival = us.partida.obtenerRival(nick);
		  		if(us.partida.turno == us){
		  			us.disparar(x,y);
		  			casillaDisparada=rival.obtenerEstado(x,y);
		  			if(us.partida.esFinal()){
		  				cli.enviarATodosEnPartida(io,codigo,"finPartida",{});
		  			}else{
		  				cli.enviarATodosEnPartida(io,codigo,"casillaDisparada",casillaDisparada);
		  			}
		  		}else{
		  			cli.enviarAlRemitente(socket,"turnoIncorrecto",{});
		  		}
		  	}
		  });

		});

	}
}

module.exports.ServidorWS=ServidorWS;