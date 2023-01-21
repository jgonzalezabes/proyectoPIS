function ControlWeb(){
	this.comprobarCookie=function(){
		if ($.cookie("nick")){
			rest.nick=$.cookie("nick");
			rest.comprobarUsuario();
			//cws.conectar();
			//this.mostrarHome();
		}
		else{
			this.mostrarAgregarUsuario();
		}
	}
	this.mostrarAgregarUsuario=function(){
		$('#mH').remove();
    $('#mAU').remove();
    $('#mInv').remove();
		let cadena= '<div class="row" id="mAU">';
		cadena=cadena+"<div class='col'>";
		cadena=cadena+'<div class="row"><div class="col"><h2>Bienvenido al juego de hundir la flota</h2></div></div>';
		cadena=cadena+'<div class="row">';
		//cadena=cadena+'<div class="col">'
    //cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick" required></div>';
    cadena=cadena+'<div class="col">';
    cadena=cadena+'<button id="btnInv" class="btn mb-2 mr-sm-2">Empezar como usuario invitado</button>';
    cadena=cadena+'<a href="/auth/google" class="btn mb-2 mr-sm-2">Accede con Google</a>';
    cadena=cadena+'</div></div>';

		$("#agregarUsuario").append(cadena);   

		$("#btnInv").on("click",function(e){
			e.preventDefault();
			iu.mostrarEmpezarInivitado();
		})
	}
	this.mostrarEmpezarInivitado=function(){
		$('#mH').remove();
    $('#mAU').remove();
    $('#mInv').remove();
		let cadena='<div id="mInv" class="invitado-card mx-auto">';
    cadena=cadena+'<h3>Inserte un nombre de usuario</h3>';
    cadena=cadena+'<form class="invitado-form">';
    cadena=cadena+'<input type="text" id="usr" placeholder="Nombre de Usuario" required/>';
    cadena=cadena+'<div id="nota"></div>';
    cadena=cadena+'<a href="/auth/google" style="color:#216ce7">Conectar con Google</a>';
    cadena=cadena+'<button id="btnAU" class="btn">Empezar</button>';
    cadena=cadena+'</form></div>';

    $('#agregarUsuario').append(cadena);

    $("#btnAU").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>12) {
				//$('#nota').remove();
			  e.preventDefault();
			  $('#nota').append('Por favor, inserte un nick más corto (máx. caracteres -> 12)');
			}
			else{
				var nick=$('#usr').val();
				$("#mAU").remove();
				//$("#aviso").remove();
				rest.agregarUsuario(nick);
			}
		})
	}
	this.mostrarHome=function(){
		$('#mH').remove();
		$('#mInv').remove();
		let cadena="<div class='row' id='mH'>";
		cadena=cadena+'<div class="col">';
		cadena=cadena+"<h4>Bienvenido "+rest.nick+". Seleccione que le gustaría hacer</h4>";
		cadena=cadena+'<button style="background-color: #dd1b09" id="btnSalir" class="btn mb-2 mr-sm-2">Cerrar Sesión</button>';
		cadena=cadena+"<div id='codigo'></div>";
		cadena=cadena+"</div></div>";
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerListaPartidasDisponibles();
		$("#btnSalir").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			cws.salir();
			rest.usuarioSale();
			$('#gc').remove();
			cws.codigo=undefined;
			$.removeCookie("nick");
			iu.comprobarCookie();
		});
	}
	this.mostrarCrearPartida=function(){
		$('#mCP').remove();
    let cadena='<div class="card" id="mCP">';
  	cadena=cadena+'<div class="card-body">'
    cadena=cadena+'<h4 style="color: #222222" class="card-title">Crear partida</h4>';
    cadena=cadena+'<p style="color: #222222" class="card-text">Crea una nueva partida y espera rival.</p>'; 
    cadena=cadena+'<button id="btnCP" class="btn mb-2 mr-sm-2">Crear partida</button>';
  	cadena=cadena+'</div>';

    $('#crearPartida').append(cadena);
    $("#btnCP").on("click",function(e){
			$("#mCP").remove();
			$('#mLP').remove();
			cws.crearPartida();
		});
	}
	this.mostrarAbandonarPartida=function(){
		let cadena='<button id="btnAP" class="btn mb-2 mr-sm-2">Abandonar partida</button>';
		cadena=cadena+"</div>";
		$('#codigo').append(cadena);
		$('#btnAP').on("click",function(e){
			cws.abandonarPartida();
		});
	}
	this.mostrarListaDePartidasDisponibles=function(lista){
		$('#mLP').remove();
		let cadena="<div class='row' id='mLP'>";
		cadena=cadena+"<div class='col'>";
		cadena=cadena+"<h2>Lista de partidas disponibles</h2>";
		cadena=cadena+'<button id="btnAL" class="btn mb-2 mr-sm-2">Actualizar</button>';
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena = cadena+'<li class="list-group-item"><a href="#" value="'+lista[i].codigo+'"> Nick propietario: '+lista[i].owner+'</a></li>';
		}
		cadena=cadena+"</ul>";
		cadena=cadena+"</div></div>";
		$('#listaPartidas').append(cadena);

		$(".list-group a").click(function(){
	        codigo=$(this).attr("value");
   	       console.log(codigo);
	        if (codigo){
	            $('#mLP').remove();
	            $('#mCP').remove();
	            cws.unirseAPartida(codigo);
	        }
	    });		
	  $("#btnAL").on("click",function(e){		
			rest.obtenerListaPartidasDisponibles();
		})
	}
	this.mostrarTurno=function(data){
		$('#mT').remove();
		if(data.turno != data.nick){
			let cadena='<form class="turno-form w-75 mx-auto">';
      cadena=cadena+'<h4 id="mT" style="color: #9d0101">Turno del contrincante</h4>';
      cadena=cadena+'</form>';
			$('#mTurno').append(cadena);
		}else{
			let cadena='<form class="turno-form">';
			cadena=cadena+'<h4 id="mT" style="color: #1ac600">Te toca disparar</h4>';
			cadena=cadena+'</form>';
			$('#mTurno').append(cadena);
		}
	}
	this.mostrarModal=function(msg){
		$('#mM').remove();
		var cadena="<p id='mM'>"+msg+"</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}
	this.finPartida=function(){
		$('#gc').remove();
		cws.codigo=undefined;
		tablero=new Tablero(10);
		//tablero.mostrar(false);
		iu.mostrarHome();
	}
}