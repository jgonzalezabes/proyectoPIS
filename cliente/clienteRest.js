function ClienteRest(){
	this.nick;
	this.agregarUsuario=function(nick){
		let cli=this;
		$.getJSON("/agregarUsuario/"+nick,function(data){ //el data es el respond.send() que tenemos en el index.js. Es lo que conecta el APIRest con el clienteRest
			//se ejecuta cuando conteste el servidor
			console.log(data);
			if (data.nick!=-1){
				console.log("Usuario "+data.nick+" registrado");
				cli.nick=data.nick;
				//$.cookie("nick",ws.nick);
				//iu.mostrarHome(data);
				cli.obtenerListaPartidas();
				iu.mostarHome();
			}
			else{
				console.log("No se ha podido registrar el usuario");
				//iu.mostrarModal("El nick ya está en uso");
				iu.mostrarAgregarUsuario();
			}
		});
	}
		//en este punto todavía no estoy seguro de que haya contestado el servidor
		//lo que pongamos aqui se ejecuta a la vez que la llamada
	this.crearPartida=function(){
		let cli=this;
		let nick=cli.nick;
		$.getJSON("/crearPartida/"+nick,function(data){
			console.log(data);
			if (data.codigo!=-1){
				console.log("Usuario "+nick+" crea partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo);

			}
			else{
				console.log("No se ha podido crear partida");
			}			
		});
	}

	this.unirseAPartida=function(nick,codigo){
		let cli=this;
		$.getJSON("/unirseAPartida/"+nick+"/"+codigo,function(data){
			console.log(data);
			if (data.codigo!=-1){
				console.log("El usuario "+cli.nick+" se unió a la partida "+data.codigo);
			}
			else{
				console.log("No se ha podido unir a la partida");
			}			
		});
	}
	this.obtenerListaPartidas=function(){
		let cli=this;
		$.getJSON("/obtenerPartidas",function(lista){
			iu.mostrarListaDePartidas(lista);			
		});
	}


}



