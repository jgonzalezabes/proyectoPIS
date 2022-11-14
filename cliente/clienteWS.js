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
			iu.mostrarModal("A jugaaar!");
		});
		this.socket.on("barcoColocado",function(barco){
			console.log(barco);
		});
		this.socket.on("casillaDisparada",function(casillaDisparada){
			console.log(casillaDisparada);
		});
		this.socket.on("finPartida",function(){
			console.log("fin de la partida");
			//iu.finPartida();
		});

	}

};
	

