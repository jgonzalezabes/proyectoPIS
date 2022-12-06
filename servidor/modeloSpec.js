let modelo=require("./modelo.js");

describe("El juego...", function() {
  var miJuego;
  var us1, us2, partida;

  beforeEach(function(){
    miJuego=new modelo.Juego(true);
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");

    let res = miJuego.jugadorCreaPartida("pepe");
    miJuego.jugadorSeUneAPartida("luis", res.codigo);
    us1=miJuego.obtenerUsuario("pepe");
    us2=miJuego.obtenerUsuario("luis");
    partida=miJuego.obtenerPartida(res.codigo);
  });

  it("comprobamos los nick de los usuarios", function() {
    expect(us1.nick).toEqual("pepe");
    expect(us2.nick).toEqual("luis");
  });

  xit("el usuario luis se une a la partida", function(){
    let codigo=us1.crearPartida();
    let partida=miJuego.partidas[codigo];
    usr2.unirseAPartida();
    expect(partida.jugadores.length).toEqual(2);
    expect(partida.jugadores[1].nick).toEqual(us2.nick);
  });

  it("usuarios en partida", function(){
    expect(partida.estoy(us1.nick));
    expect(partida.estoy(us2.nick));
  });

  it("comprobar tableros de los usuarios",function(){
    expect(us1.tableroPropio).toBeDefined();
    expect(us1.tableroPropio.esTablero()).toEqual(true); //no se si haría falta poner el toBeTrue()
    expect(us1.tableroPropio.casillas.length).toEqual(5);
    expect(us1.tableroPropio.casillas[0].length).toEqual(5);
    //comprobamos que las casillas son agua
    for (i=0;i<5;i++){
      for (j=0;j<5;j++){
        expect(us1.tableroPropio.casillas[i][j].esAgua()).toEqual(true);;
      }
    }
  });

  it("los dos jugadores tienen flota",function(){
    expect(us1.flota).toBeDefined();  
    expect(us2.flota).toBeDefined();  

    expect(Object.keys(us1.flota).length).toEqual(2);
    expect(Object.keys(us2.flota).length).toEqual(2);

    expect(us1.flota["b2"].tam).toEqual(2);
    expect(us1.flota["b4"].tam).toEqual(4);
  })

  it("la partida se ha desplegado",function(){
    expect(partida.esJugando()).toEqual(false);
    expect(partida.esDesplegando()).toEqual(true);;
  });

  describe("A jugar!",function(){
    beforeEach(function(){
      us1.colocarBarco("b2",0,0); //0,0 1,0
      us1.colocarBarco("b4",0,1); //0,1 1,1 2,1 3,1
      us1.barcosDesplegados();
      us2.colocarBarco("b2",0,0);
      us2.colocarBarco("b4",0,1);
      us2.barcosDesplegados();
    });

    xit("Comprobar que las flotas están desplegadas", function(){

    });

    it("Comprobar jugada que Pepe gana", function(){
      us1.disparar(0,0);
      us1.disparar(1,0);
      us1.disparar(0,1);
      us1.disparar(1,1);
      us1.disparar(2,1);
      us1.disparar(3,1);
      expect(partida.fase).toEqual("final");
      expect(us1.flotaHundida()).toEqual(false);
      expect(us2.flotaHundida()).toEqual(true);
    });

    xit("Comprobar cambio de turno", function(){
      
    });
  })
});
