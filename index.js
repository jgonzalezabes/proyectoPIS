//Para arrancar el servidor tenemos que usar node index.js

const fs=require('fs');
const express=require('express');
const app=express();
const modelo = require("./servidor/modelo.js");

const PORT = process.env.PORT || 3000;

let juego = new modelo.Juego();

//HTTP GET POST PUT DELETE
/*

get "/"
get "/obtenerPartida"
post get"/agregarUsuario/:nick"
put "/actualizarPartida"
delete "/"
...*/

app.use(express.static(__dirname + "/"));

app.get("/", function(request,response){
	var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.get("/agregarUsuario/:nick", function(request,response){
	let nick = request.params.nick;
	let res;
	res=juego.agregarUsuario(nick);
	response.send(res); //debemos responder al servidor siempre

});

app.get("/crearPartida/:nick", function(request,response){
	let nick = request.params.nick;
	let res = juego.jugadorCreaPartida(nick);

//	let usr = juego.usuarios[nick]; //juego.obtenerUsuario(nick)
//	let res={codigo:-1};
//	let codigo;
//	if (usr){
//		codigo=usr.crearPartida();
//		res={codigo.codigo};
//	}

	response.send(res); //debemos responder al servidor siempre

});

app.get("/unirseAPartida/:nick/:codigo", function(request,response){
	let nick = request.params.nick;
	let codigo = request.params.codigo;
	let res=juego.jugadorSeUneAPartida(nick,codigo);
	response.send(res); //debemos responder al servidor siempre
});

app.get("/obtenerPartidas", function(request,response){
	let res=juego.obtenerPartidas();
	response.send(res); //debemos responder al servidor siempre
});

app.get("/obtenerPartidasDisponibles", function(request,response){
	let res=juego.obtenerPartidasDisponibles();
	response.send(res); //debemos responder al servidor siempre
});



//Start server

app.listen(PORT, ()=>{
	console.log(`App está escuchando en el puerto ${PORT}`);
	console.log(`Press Ctrl+C to quit.`);
})