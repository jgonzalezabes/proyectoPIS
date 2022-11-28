function ClienteWS(){
	this.socket;
	this.codigo;

	//enviar peticiones
	this.conectar=function(){
		this.socket=io();
		this.servidorWS();

	}
	this.crearPartida=function(){ //encapsula el emit
		this.socket.emit("crearPartida",rest.nick);
	}
	this.unirseAPartida=function(){
		this.socket.emit("unirseAPartida",rest.nick,codigo);
	}
	this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",rest.nick);
	}
	this.colocarBarco=function(nombre,x,y){
		this.socket.emit("colocarBarco",rest.nick,nombre,x,y);
	}
	this.barcosDesplegados=function(){
		this.socket.emit("barcosDesplegados",rest.nick);
	}
	this.disparar=function(x,y){
		this.socket.emit("disparar",rest.nick,x,y);
	}


	//gestionar peticiones
	this.servidorWS=function(){
		let cli=this;

		this.socket.on("partidaCreada", function(data){
			console.log(data);
			if (data.codigo!= -1){
				console.log("Usuario "+rest.nick+" crea partida codigo: "+data.codigo)
				iu.mostrarCodigo(data.codigo);
				cli.codigo=data.codigo;
			}
			else{
				console.log("No se ha podido crear partida")
			}});

		this.socket.on("unidoAPartida", function(data){
			if (data.codigo!= -1){
				console.log("Usuario "+cli.nick+" se une a partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo); //muestra el codigo de la partida
				cli.codigo=data.codigo;
			}
			else{
				console.log("No se ha podido unir a partida")
			}
		});
		this.socket.on("actualizarListaPartidas",function(lista){
			if (!cli.codigo){
				iu.mostrarListaDePartidasDisponibles(lista);
			}
		});
		this.socket.on("jugadorAbandona",function(data){
			iu.mostrarHome();
			//iu.finPartida(); //debe eliminar atributos, y todo eso
		});
		this.socket.on("aColocar",function(){
			iu.mostrarModal("Coloque sus barcos!");
		});
		this.socket.on("aJugar",function(){
			if (res.fase=="jugando"){
				console.log("A jugaar! Turno de: "+res.turno);
			}
		});
		this.socket.on("barcoColocado",function(res){
			console.log("Barco "+res.barco+" colocado?: "+res.colocado);
			let barco=tablero.flota[res.barco];
			if (res.colocado){
				tablero.terminarDeColocarBarco(barco,res.x,res.y);
				cli.barcosDesplegados();
			}
			else{
				iu.mostrarModal("No se puede colocar barco");
			}
		});
		this.socket.on("faseDesplegando",function(data){
			tablero.flota=data.flota;
			//tablero.mostrar(true);
			tablero.elementosGrid();
			tablero.mostrarFlota();//data.flota);
			console.log("Ya puedes desplegar la flota");
		});
		/*this.socket.on("jugadorAbandona",function(data){
			iu.mostrarModal("Jugador "+data.nick+" abandona");
			iu.finPartida();
		});*/
		this.socket.on("casillaDisparada",function(casillaDisparada){
			console.log(casillaDisparada);
		});
		this.socket.on("turnoIncorrecto",function(){
			console.log("Espere su turno");
		});
		this.socket.on("finPartida",function(res){
			console.log("Fin de la partida");
			console.log("Ganador: "+res.turno);
			iu.mostrarModal("Fin de la partida. Ganador: "+res.turno);
			iu.finPartida();
		});

	}

};
	

