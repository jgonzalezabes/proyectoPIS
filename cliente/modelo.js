function Juego(){
	this.partidas={};
	this.usuarios={}; //array asociativo

	this.agregarUsuario=function(nick){
		if (!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick, this)
		}
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.crearPartida=function(usr){
		let codigo=Date.now();
		this.partidas[codigo]=new Partida(codigo, usr);
		return codigo;
	}
	this.unirseAPartida=function(codigo,usr){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarJugador(usr);
		}
		else{
		console.log("la partida no existe");
		}
	}
	this.obtenerPartidas=function(){
		let lista=[];
		for (let key in this.partidas){
			lista.push({"codigo":key, "owner":this.partidas[codigo].owner})
		}
		return lista;
	}
	this.obtenerPartidasDisponibles=function(){
		//devolver solo las partidas que no estén completas en cuanto a jugadores
		let lista=[];
		for (let key in this.partidas){
			if(key.jugadores.length<2){
				lista.push({"codigo":key, "owner":this.partidas[codigo].owner})
			}
		}
		return lista;
	}
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego;
	this.crearPartida=function(){
		return this.juego.crearPartida(this)
	}
	this.unirseAPartida=function(codigo){
		this.juego.unirseAPartida(codigo,this);
	}
}

function Partida(codigo, usr){
	this.codigo=codigo;
	this.owner=usr;
	this.jugadores={};
	this.fase="Inicial";	//new Inicial();
	//this.maxJugadores=2;
	this.agregarJugador=function(usr){
		if (this.jugadores.length<2){
			this.jugadores.push(usr);
			}else{
			console.log("La partida está completa");
		}
	}

	this.agregarJugador(this.owner);

}

