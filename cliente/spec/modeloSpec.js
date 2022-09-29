describe("El juego...", function() {
  var miJuego;
  var usr1, usr2;

  beforeEach(function(){
    miJuego=new Juego();
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    usr1=miJuego.usuarios["pepe"];
    usr2=miJuego.usuarios["luis"];
  });

  it("inicialmente", function() {
    let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(0);
    expect(urs1.nick).toEqual("pepe");
    expect(urs2.nick).toEqual("luis");
  });

  xit("crear partida", function() {
    let codigo=usr1.crearPartida();
    expect(miJuego.partidas[codigo]).toBeDefined();
    let partida=miJuego.partidas[codigo];
    expect(partida.owner,nick).toEqual(usr1.nick);
    expect(partida.jugadores[0].nick).toEqual(usr1.nick);
    expect(partidas.codigo).toEqual(codigo);
  });

  xit("el usuario luis se une a la partida",function(){

    
  });

});
