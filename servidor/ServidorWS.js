function ServidorWS(){

	//enviar peticiones
	this.enviarAlRemitente=function(socket,mensaje,datos){ //a la persona que le ha enviado un socket al servidor
		socket.emit(mensaje,datos);
	}
	this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
		io.sockets.in(codigo).emit(mensaje,datos)
	}
	this.enviarAlRestoPartida=function(socket,codigo,mensaje,datos){
    socket.broadcast.to(codigo).emit(mensaje,datos);
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
		  	let codigoStr=res.codigo.toString();
				socket.join(codigoStr);
		  	cli.enviarAlRemitente(socket,"partidaCreada", res);
		  	let lista=juego.obtenerPartidasDisponibles();
		  	cli.enviarATodos(socket,"actualizarListaPartidas",lista);
		  });

		  socket.on("unirseAPartida",function(nick, codigo){
		  	let partida=juego.obtenerPartida(codigo);
		  	if(partida && partida.fase=="inicial" && partida.owner.nick!=nick){
			  	let res = juego.jugadorSeUneAPartida(nick, codigo);
			  	let codigoStr=codigo.toString();
					socket.join(codigoStr);
					let lista=juego.obtenerPartidasDisponibles();
		    	cli.enviarATodos(socket,"actualizarListaPartidas",lista); 
					cli.enviarAlRemitente(socket,"unionAPartida", res);
					let partida=juego.obtenerPartida(codigo);
          if (partida.esDesplegando()){
              let us =juego.obtenerUsuario(nick);
              let flota=us.obtenerFlota();
              let res={};
              res.flota=flota; 
              cli.enviarATodosEnPartida(io,codigoStr,"faseDesplegando",res);
          }
		    }else{
		    	cli.enviarAlRemitente(socket,"partidaNoEncontrada", {});
		    }
		  });
		  socket.on("abandonarPartida",function(nick, codigo){ 
		  	let usr =juego.obtenerUsuario(nick)
			  if(usr){
			  	let codigoStr=codigo.toString();//también debemos mostrar un modal al otro jugador diciéndole que el jugador "nick" ha abandonado la partida y elminar la partida
			  	juego.jugadorAbandona(nick,codigo);
			  	cli.enviarATodosEnPartida(io,codigoStr,"jugadorAbandona",nick);

			  	let lista=juego.obtenerPartidasDisponibles();
			  	cli.enviarATodos(socket,"actualizarListaPartidas",lista);
		  	}
		  });
		  socket.on("salir",function(nick, codigo){ //también debemos mostrar un modal al otro jugador diciéndole que el jugador "nick" ha abandonado la partida y elminar la partida
			  if(codigo){
				  let usr =juego.obtenerUsuario(nick)
				  if(usr){
				  	let codigoStr=codigo.toString();
				  	console.log("servidor salir");
				  	juego.jugadorAbandona(nick,codigo);
				  	console.log(usr.partida.fase);
				  	cli.enviarAlRestoPartida(socket,codigoStr,"jugadorAbandona",nick);

				  	let lista=juego.obtenerPartidasDisponibles();
				  	cli.enviarATodos(socket,"actualizarListaPartidas",lista);
				  }
				}
		  });
		  socket.on("colocarBarco",function(nick,nombre,x,y){
		  	let us = juego.obtenerUsuario(nick);
		  	if(us){
		  		let colocado=us.colocarBarco(nombre,x,y);
		  		cli.enviarAlRemitente(socket,"barcoColocado", {nombre,x,y,colocado});
		  	}
		  });
		  socket.on("barcosDesplegados",function(nick){
		  	let us = juego.obtenerUsuario(nick);
		  	if(us){
		  		us.barcosDesplegados();
		  		if(us.partida.esJugando()){
		  			let codigoStr=us.partida.codigo.toString();
		  			let res={"turno":us.partida.turno.nick};
		  			cli.enviarATodosEnPartida(io,codigoStr,"aJugar", res);
		  		}
		  	}
		  });
		  socket.on("disparar",function(nick,x,y){
		  	let us = juego.obtenerUsuario(nick);
		  	if(us && us.partida.turno == us && us.partida.esJugando()){
		  		let codigoStr=us.partida.codigo.toString();

	  			us.disparar(x,y);
	  			let impacto=us.obtenerEstadoMarcado(x,y);
	  			console.log(impacto);
	  			if(us.partida.esFinal()){
	  				let res={"turno":us.partida.turno.nick};
	  				cli.enviarATodosEnPartida(io,codigoStr,"finPartida",res);
	  			}else{
	  				let res={"turno":us.partida.turno.nick};
	  				let data={"x":x,"y":y,"impacto":impacto,"turno":us.partida.turno.nick,"atacante":us.nick}
	  				cli.enviarATodosEnPartida(io,codigoStr,"disparo",data);
	  				cli.enviarATodosEnPartida(io,codigoStr,"turnoUsuario",res);
	  			}
	  		}else{
	  			cli.enviarAlRemitente(socket,"turnoIncorrecto",{});
		  	}
		  });

		});

	}
}

module.exports.ServidorWS=ServidorWS;