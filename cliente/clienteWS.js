function ClienteWS(){
	this.socket;

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

	//gestionar peticiones
	this.servidorWS=function(){
		let cli=this;

		this.socket.on("partidaCreada", function(data){
			console.log(data);
			if (data.codigo!=-1){
				console.log("Usuario "+rest.nick+" crea partida codigo: "+data.codigo)
				iu.mostrarCodigo(data.codigo);
			}
			else{
				console.log("No se ha podido crear partida")
			}

		this.socket.on("unidoAPartida", function(data){
			if (data.codigo!=-1){
				console.log("Usuario "+cli.nick+" se une a partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo);
			}
			else{
				console.log("No se ha podido unir a partida")
			}
		})
		});
	}

}