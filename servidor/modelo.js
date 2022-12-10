let cad=require('./cad.js');

function Juego(test){
	this.partidas={};
	this.usuarios={}; //array asociativo
	this.cad=new cad.Cad();
	this.test=test;

	this.agregarUsuario=function(nick){
		let res={"nick":-1};
		if (!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick,this);
			res={"nick":nick};
			console.log("Nuevo usuario: "+nick);
			this.insertarLog({"operacion":"Inicio de sesión","usuario":nick,"fecha":Date()},function(){
				console.log("Registro de log insertado");
			});
		}
		return res;
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.usuarioSale=function(nick){
		if (this.usuarios[nick]){
			this.finalizarPartida(nick);
			this.eliminarUsuario(nick);
			this.insertarLog({"operacion":"Sign Out","usuario":nick,"fecha":Date()},function(){
				console.log("Registro de log insertado");
			});
		}
	}
	this.jugadorCreaPartida=function(nick){
		let usr = this.usuarios[nick];
		let res={codigo:-1};
  		if (usr){
    		let codigo=usr.crearPartida();
	    	//let codigo=this.crearPartida(usr);
	    	res={codigo:codigo};
	    }
    	return res;
	}
	this.jugadorSeUneAPartida=function(nick,codigo){
		let usr = this.usuarios[nick];
		let res={"codigo":-1};
  		if (usr){
    		let valor=usr.unirseAPartida(codigo);
    		//let valor=this.unirseAPartida(codigo,usr)
	    	res={"codigo":valor};
	    }
    	return res;
	}
	this.obtenerUsuario=function(nick){
		if (this.usuarios[nick]){
			return this.usuarios[nick];
		}
	}
	this.crearPartida=function(usr){
		let codigo=Date.now();
		console.log("Usuario "+usr.nick+ " crea partida "+codigo);
		this.insertarLog({"operacion":"crearPartida", "Codigo partida":codigo ,"propietario":usr.nick,"fecha":Date()},function(){
			console.log("Registro de log insertado");
		});
		this.partidas[codigo]=new Partida(codigo,usr); 
		return codigo;
	}
	this.unirseAPartida=function(codigo,usr){
		let res=-1;
		if (this.partidas[codigo]){
			res=this.partidas[codigo].agregarJugador(usr);
		}
		else{
			console.log("La partida no existe");
		}
		return res;
	}
	this.obtenerPartidas=function(){
		let lista=[];
		for (let key in this.partidas){
			lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
		}
		return lista;
	}
	this.obtenerPartidasDisponibles=function(){
		let lista=[];
		for (let key in this.partidas){
			if (this.partidas[key].fase=="inicial"){
				lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
			}
		}
		return lista;
	}
	this.finalizarPartida=function(nick){
		for (let key in this.partidas){
			if (this.partidas[key].fase=="inicial" && this.partidas[key].estoy(nick)){
				this.partidas[key].fase="final";
				this.insertarLog({"operacion":"FinalizarPartida","partida":this.partidas[key].codigo,"fecha":Date()},function(){
					console.log("Registro de log insertado");
				});
			}
		}
	}
	this.obtenerPartida=function(codigo){
		return this.partidas[codigo];
	}
	this.jugadorAbandona = function(nick, codigo){
		if(this.partidas[codigo]){
			this.partidas[codigo].fase = "final";	
			this.insertarLog({"operacion":"jugadorAbandonaPartida","usuario":nick,"partida":this.partida,"fecha":Date()},function(){
				console.log("Registro de log insertado");
			});
		}
	}
	this.insertarLog=function(log,callback){
		if (this.test == "false"){
			this.cad.insertarLog(log,callback);
		}
	}

	this.obtenerLogs=function(callback){
		this.cad.obtenerLogs(callback);
	}

	if(this.test == "false"){
		this.cad.conectar(function(db){
			console.log("Conectado a Atlas");
		})
	}
}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.tableroPropio;
	this.tableroRival;
	this.partida;
	this.flota={}; //podría ser array []
	this.crearPartida=function(){
		return this.juego.crearPartida(this)
	}
	this.unirseAPartida=function(codigo){
		return this.juego.unirseAPartida(codigo,this);
	}
	this.inicializarTableros=function(dim){
		this.tableroPropio=new Tablero(dim);
		this.tableroRival=new Tablero(dim);
	}
	this.inicializarFlota=function(){
		// this.flota.push(new Barco("b2",2));
		// this.flota.push(new Barco("b4",4));
		this.flota["b2"]=new Barco("b2",2);
		this.flota["b4"]=new Barco("b4",4);
		this.flota["b9"]=new Barco("b9",9);
		this.flota["b5"]=new Barco("b5",5);
		this.flota["b1"]=new Barco("b1",1);
		// otros barcos: 1, 3, 5,...
	}
	this.colocarBarco=function(nombre,x,y){
		//comprobar fase
		if (this.partida && this.partida.fase=="desplegando"){//poner otro && que te diga que si una barco esté desplegado no te deje colocarlo
			let barco=this.flota[nombre];
			if(!barco.desplegado){
				return this.tableroPropio.colocarBarco(barco,x,y);
		}
		}
		return false;
	}
	this.todosDesplegados=function(){
		for(var key in this.flota){
			if (!this.flota[key].desplegado){
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados=function(){
		if(this.partida && this.partida.esDesplegando()){
		this.partida.barcosDesplegados();
		}
	}
	this.disparar=function(x,y){
		if(x<=this.tableroPropio.size && y<=this.tableroPropio.size && x>=0 && y>=0){
			this.partida.disparar(this.nick,x,y);
		}
	}
	this.meDisparan=function(x,y){
		return this.tableroPropio.meDisparan(x,y);
	}
	this.obtenerEstado=function(x,y){
		return this.tableroPropio.obtenerEstado(x,y);
	}
	this.obtenerEstadoMarcado=function(x,y){
		return this.tableroRival.obtenerEstado(x,y);
	}
	this.obtenerFlota=function(){
		return this.flota;
	}
	this.marcarEstado=function(estado,x,y){
		this.tableroRival.marcarEstado(estado,x,y);
		if (estado=="agua"){
			this.partida.cambiarTurno(this.nick);
		}
	}
	this.flotaHundida=function(){
		for(var key in this.flota){
			if (this.flota[key].estado!="hundido"){
				return false;
			}
		}
		return true;
	}
	this.insertarLog=function(logs, callback){
		this.juego.insertarLog(logs, callback);
	}
}


function Partida(codigo,usr){
	this.codigo=codigo;
	this.owner=usr;
	this.jugadores=[];
	this.fase="inicial"; //new Inicial()
	this.maxJugadores=2;
	this.agregarJugador=function(usr){ //this.puedeAgregarJugador
		let res=this.codigo;
		if (this.hayHueco()){
			this.jugadores.push(usr);
			console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo);
			usr.partida=this;
			usr.inicializarTableros(10);
			usr.inicializarFlota();
			this.comprobarFase();
			usr.insertarLog({"operacion":"unirseAPartida","Codigo Partida":this.codigo,"jugador2":usr.nick,"fecha":Date()},function(){
				console.log("Registro de log insertado");
			});
		}
		else{
			res=-1;
			console.log("La partida está completa")
		}
		return res;
	}
	this.comprobarFase=function(){
		if (!this.hayHueco()){
			this.fase="desplegando";
		}
	}
	this.hayHueco=function(){
		return (this.jugadores.length<this.maxJugadores)
	}
	this.estoy=function(nick){
		for(i=0;i<this.jugadores.length;i++){
			if (this.jugadores[i].nick==nick){
				return true
			}
		}
		return false;
	}
	this.esJugando=function(){
		return this.fase=="jugando";
	}
	this.esDesplegando=function(){
		return this.fase=="desplegando";
	}
	this.esAbandonada=function(){
		return this.fase=="abandonada";
	}
	this.esFinal=function(){
		return this.fase=="final";
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.flotasDesplegadas=function(){
		for(i=0;i<this.jugadores.length;i++){
			if (!this.jugadores[i].todosDesplegados()){
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados=function(){
		if (this.flotasDesplegadas()){
			this.fase="jugando";
			this.asignarTurnoInicial();
		}
	}
	this.asignarTurnoInicial=function(){
		this.turno=this.jugadores[0];
	}
	this.cambiarTurno=function(nick){
		this.turno=this.obtenerRival(nick);
	}
	this.obtenerRival=function(nick){
		let rival;
		for(i=0;i<this.jugadores.length;i++){
			if (this.jugadores[i].nick!=nick){
				rival=this.jugadores[i];
			}
		}
		return rival;
	}
	this.obtenerJugador=function(nick){
		let jugador;
		for(i=0;i<this.jugadores.length;i++){
			if (this.jugadores[i].nick==nick){
				jugador=this.jugadores[i];
			}
		}
		return jugador;
	}
	this.disparar=function(nick,x,y){
		let atacante=this.obtenerJugador(nick);
		if (this.turno.nick==atacante.nick){
			let atacado=this.obtenerRival(nick);
			let estado=atacado.meDisparan(x,y);
			//let estado=atacado.obtenerEstado(x,y);
			atacante.marcarEstado(estado,x,y);
			this.comprobarFin(atacado);
		}	
		else{
			console.log("No es tu turno")
		}
	}
	this.comprobarFin=function(jugador){
		if (jugador.flotaHundida()){
			this.fase="final";
			console.log("Fin de la partida");
			console.log("Gandor: "+this.turno.nick);
		}
	}
	this.agregarJugador(this.owner);
}

function Tablero(size){
	this.size=size; //filas=columnas=size
	this.casillas;
	this.crearTablero=function(tam){
		this.casillas=new Array(tam);
		for(x=0;x<tam;x++){
			this.casillas[x]=new Array(tam);
			for(y=0;y<tam;y++){
				this.casillas[x][y]=new Casilla(x,y);
			}
		}
	}
	this.colocarBarco=function(barco,x,y){
		if (this.casillasLibres(x,y,barco.tam)){
			for(i=x;i<x+barco.tam;i++){
				this.casillas[i][y].contiene=barco;
			}
			barco.desplegado=true;
			return true;
		}
		return false;
	}
	this.casillasLibres=function(x,y,tam){
		if(x+tam>this.size){
			console.log("el barco se sale del tablero");
			return false;
		}
		for(i=x;i<x+tam;i++){
			let contiene=this.casillas[i][y].contiene;
			if (!contiene.esAgua()){
				console.log("No es agua");
				return false;
			}
		}
		return true;
	}
	this.ponerAgua=function(x,y){
		this.casillas[x][y].contiene=new Agua();
	}
	this.meDisparan=function(x,y){
		return this.casillas[x][y].contiene.meDisparan(this,x,y);
	}
	this.obtenerEstado=function(x,y){
		return this.casillas[x][y].contiene.obtenerEstado();
	}
	this.marcarEstado=function(estado,x,y){
		this.casillas[x][y].contiene.estado=estado;
	}
	this.esTablero=function(){
		return true;
	}
	this.crearTablero(size);
}

function Casilla(x,y){
	this.x=x;
	this.y=y;
	this.contiene=new Agua();
}

function Barco(nombre,tam){ //"b2" barco tamaño 2
	this.nombre=nombre;
	this.tam=tam;
	this.orientacion; //horizontal, vertical...
	this.desplegado=false;
	this.estado="intacto";
	this.disparos=0;
	this.esAgua=function(){
		return false;
	}
	this.meDisparan=function(tablero,x,y){
		this.disparos++;
		if (this.disparos<this.tam){
			this.estado="tocado";
			console.log("Tocado");
		}
		else{
			this.estado="hundido";
			console.log("Hundido!!!");
		}
		tablero.ponerAgua(x,y);
		return this.estado;
	}
	this.obtenerEstado=function(){
		return this.estado;
	}
	this.esAgua=function(){
		return false;
	}
}

function Agua(){
	this.nombre="agua";
	this.estado="agua";
	this.esAgua=function(){
		return true;
	}
	this.meDisparan=function(tablero,x,y){
		console.log("agua");
		return this.estado;
	}
	this.obtenerEstado=function(){
		return this.estado;
	}
	this.esAgua=function(){
		return true;
	}
}

/*function Inicial(){
	this.nombre="inicial";
}

function Jugando(){
	this.nombre="jugando";
}

function Desplegando(){
	this.nombre="desplegando";
}*/

module.exports.Juego = Juego;