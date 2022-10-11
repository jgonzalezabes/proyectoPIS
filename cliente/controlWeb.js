function ControlWeb(){
	this.mostrarAgregarUsuario=function(){
		var cadena= '<div class="row" id="mAU">';//'<form class="form-row needs-validation"  id="mAU">';
		cadena=cadena+'<div class="col">';
		cadena=cadena+'<div class="row"><div class="col"><h2>El juego indefinido</h2></div></div>';
		cadena=cadena+'<div class="row">';
		cadena=cadena+'<div class="col">'
        cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        //cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
        cadena=cadena+'</div>'; //' </form>';
        cadena=cadena+'<div id="nota"></div></div></div>';

		$("#agregarUsuario").append(cadena);     
		//$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

		$("#btnAU").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>6) {
			    e.preventDefault();
			    $('#nota').append('Nick inválido');
			}
			else{
				var nick=$('#usr').val();
				$("#mAU").remove();
				//$("#aviso").remove();
				rest.agregarUsuario(nick);
			}
		})
	}
	this.mostarHome=function(){
		$('mH').remove();
		var cadena= '<div class="row" id="mH">'
		cadena=cadena+'<div class="col">';
		cadena=cadena+"<p>Bienvenido "+rest.nick+" </p>";
		cadena=cadena+"<div id='codigo'></div>"
		cadena=cadena+'</div></div>';
		$("#agregarUsuario").append(cadena);    
		this.mostrarCrearPartida(); 
	}
	this.mostrarCrearPartida=function(){
		$('mCP').remove();
		var cadena= '<div class="row" id="mCP">';//'<form class="form-row needs-validation"  id="mAU">';
		cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear Partida</button>';
        cadena=cadena+'</div></div>'; //' </form>';
        $('#crearPartida').append(cadena);
        $("#btnCP").on("click",function(e){
			$("#mCP").remove();
			//$("#aviso").remove();
			rest.crearPartida();
		})
	}
	this.mostrarCodigo=function(codigo){
		let cadena="Codigo de la partida: "+codigo;
		$('#codigo').append(codigo);
	}
	this.mostrarListaDePartidas=function(lista){ //no funciona este método (hace que se rompa todo)
		//crear un control visual tipo lista (tabla, dropdown o algo asi) para mostrar
		// la lista de partidas y permitir unirse
		let cadena='<div id="mLP">';
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
			cadena=cadena+'<li class="list-group-item">'+lista[i].codigo+'</li>';
		}
		cadena=cadena+"</ul>";
		cadena=cadena+"</div>";
		$('#listaPartidas').append(cadena);

	}

}