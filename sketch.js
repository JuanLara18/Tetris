let actualFigura = 0;
let siguienteFigura = 0;
let audio;
let audiofinal;
let slideVol;
let nivel = 1;
let puntaje = 0;
let lineas = 0;
let tiempo = 0;
let estapausado = 0;

function preload(){                   // Cargamos los sonidos
  audio = loadSound('sonidos/audio.mp3');
  audiofinal = loadSound('sonidos/over.mp3')
}

function setup() {                   // Realizamos las configuraciones iniciales de la página y el canvas

  let canvas = createCanvas(dimen+330, dimenp);                     // Creamos el canvas
  canvas.position((windowWidth-dimen)/2, 150, 'absolute');          // Definimos la posición del canvas en el centro

  frameRate(fr);                   // Definimos los cuadros por segundo 

  //Reproducimos el audio
  audio.loop();                    // Reproducimos el volumen
  audio.setVolume(0);              // Iniciamos el volumen en 0
  if (getAudioContext().state !== 'running') {          // Solucionesmos getAudioContext problema usual del navegador
      getAudioContext().resume();
    }
  audio.rate(0.0225*nivel + 0.8975);            // Cambiamos la velocidad de la musica según el nivel de 0.92 a 1.1

  // Configuramos el menu principal

  let menu = createElement('h1', 'Menú principal');                 // Creamos el título de Menú principal
  menu.position((windowWidth-dimen)/2 - 300,200,'absolute')         // Ubicamos el título de Menú principal

  let nuevoju = createButton('Nuevo juego')                         // Creamos el botón de Nuevo Juego
  nuevoju.position((windowWidth-dimen)/2 - 280,300,'absolute')      // Ubicamos el botón de Nuevo Juego
  nuevoju.mousePressed(recargar)                                    // Definimos la función del botón Nuevo Juego al oprimirlo
  
  let paus = createButton('Pausa')                                  // Creamos el botón de Pausa
  paus.position((windowWidth-dimen)/2 - 280,350,'absolute')         // Ubicamos el botón de Pausa
  paus.mousePressed(pausaa);                                        // Definimos la función del botón Pausa al apromirlo

  let acer = createButton('Acerca')                                 // Creamos el botón Acerca
  acer.position((windowWidth-dimen)/2 - 280, 400,'absolute')        // Ubicamos el botón Acerca
  acer.mousePressed(wiki)                                           // Definimos la función del botón Acerca al oprimirlo

  let niv = createElement('h2', 'Nivel: ')                          // Creamos un subtítulo de Nivel
  niv.position((windowWidth-dimen)/2 - 210, 450,'absolute')         // Posicionamos el subtítulo Nivel
  
  slideNiv = createP('nivel');                                      // Creamos un elemento P para el nivel
  slideNiv.position((windowWidth-dimen)/2 - 186,500,'absolute')     // Ubicamos el elemento P para el nivel

  let son = createElement('h2', 'Volumen: ')                        // Creamos el subtítulo de Volumen
  son.position((windowWidth-dimen)/2 - 230,550,'absolute')          // Ubicamos el subtítulo de Volumen

  slideVol = createSlider(0,1,0.1,0.01);                              // Creamos un slider para controlar el volumen de 0 a 1 iniciando en 1 con particiones de 0.001
  slideVol.position((windowWidth-dimen)/2 - 300,615,'absolute')     // Ubicamos el slide de Volumen
  slideVol.size(245)                                                // Definimos el tañamo del slide de Volumen

  

  let punt = createElement('h2', 'Puntaje: ')                       // Creamos un subtítulo de Puntaje
  punt.position((windowWidth-dimen)/2 + 470, 210, 450,'absolute')   // Ubicamos el subtítulo de Puntaje
  
  punta = createP('asdf');                                          // Creamos un elemento P para el puntaje
  punta.position((windowWidth-dimen)/2 + 510, 260, 'absolute')      // Ubicamos el elemento P de puntaje

  let siguien = createElement('h2', 'Siguiente ficha:')             // Creamos el subtítulo de Siguiente Ficha
  siguien.position((windowWidth-dimen)/2 + 440, 330,'absolute')     // Ubicamos el subtítulo de Siguiente Ficha

  tiemp = createP('tiemp');                                         // Creamos un elemento P para el tiempo
  tiemp.position((windowWidth-dimen)/2 + 400, 560,'absolute')       // Ubicamos el elemento P para el tiempo


  generaFigura();                   // Generamos las figuras actualFigura y siguienteFigura

  setInterval(cronometro, 1000)     // Ejecutamos la función cronometro cada segunda (1000 milisegundos)
  
  textStyle(BOLD)                   // Definimos el estilo del texto (solo para text())
  textSize(30)                      // Definimos el tamaño del texto (solo para text())
}

function draw() {                   // Dibujamos los elementos del canvas (mapa, tetrominos, ...)

  plantilla();              // Dibujamos una plantilla predeterminada

  if( frameCount % Math.round(fr/(nivel+1)) <= 0.5 && estapausado == 0){        // Definimos la frecuencia de caida
    caer()
  }

  
  if( puntaje % 2000 == 1999){          // Cambiamos de nivel cada 2000 puntos
    puntaje++
    // Limpiamos el mapa como lo tenemos al inicio
    Matrix1 = Array(anc+1).fill().map(() => Array(lar-1).fill(null))    
    Matrix1.push(bloquescol);
    Matrix1.shift();
    for(let i = 0; i < Matrix1.length; i++){ //Ponemos piso en el mapa
      Matrix1[i].unshift(null); //Añade al inicio
      Matrix1[i].push(new Cuadro(0,0,0,'yellow'));
      Matrix1[anc][0] = new Cuadro(0,0,0,'yellow')
    } 
    nivel++
    
    generaFigura();
  }
  
  if(true){                             // Imprimimos ¡Subiste de nivel! cada que suba de nivel (son dos casos para notar luego la diferencia)
    if (nivel > 1 && nivel % 2 == 0) {
      stroke('red')
      text('¡Subiste de nivel!', 415, 530)
    } 
    if (nivel > 1 && nivel % 2 == 1) {
      stroke('blue')
      text('¡Subiste de nivel!', 415, 560)
    } 
  }
  
  
  for (let i = 0; i < Matrix1[0].length-1; i++) {           // Verificamos las filas completadas
    let n = 0;
    for (let j = 0; j < Matrix1.length-1; j++) {         // columnas
      if ( Matrix1[j][i] ) {
        n++;
      }
      if(n == anc){             // Si la fila está completa
        lineas++;               // Contamos una línea más 
        puntaje += 20*nivel;    // Aumentamos el puntaje con la línea que se acaba de completar
        for (let k = 0; k < Matrix1.length; k++) {      // Eliminamos la fila
            Matrix1[k][i] = null;
          }
        for (let r = i; r > 0; r--){                    // Movemos luego de haber eliminado la fila
          for (let s = 0; s < Matrix1.length; s++){
            Matrix1[s][r] = Matrix1[s][r-1];
          }
        }
      }
    }  
  }
  
  
  Matrix1.forEach( (x,i) =>                                 // Cuadramos la posición de los elementos del mapa
  x.forEach ( (e,j) => 
  {
      if(e) {
          e.x = (i+1)*escala;
          e.y = j*escala
      }
  }
  )
)
  Matrix1.forEach( x =>                                     // Mostramos el mapa
    x.filter( j => j != null).forEach(e => 
      e.mostrar()
    )
  )

  siguienteFigura.mostrar();                                // Mostramos la Siguiente Ficha
  actualFigura.mostrar();                                   // Mostramos la ficha que cae
  actualFigura.posicion();                                  //  Capturamos la posición de figura que se mueve en Matrix2

  for (let i = 0; i < Matrix1.length - 1; i++) {            // Verificamos el final del juego
    if( Matrix1[i][0] && estapausado !=4 ){
      estapausado = 3
      audio.stop()
      textSize(50)
      stroke('white')
      text('¡Fin del juego!', dimen/2 - 170, dimenp/2 - 20)
      noLoop()
    } 
  }
  gameoverso()
  
}

function keyPressed(){              // Definimos los controles del juego
  if( estapausado == 0){
    if (keyCode === DOWN_ARROW && !actualFigura.colision('abajo')) {                    // Permite bajar la ficha con flecha abajo
      actualFigura.y += escala;
      puntaje++
    } else if (keyCode === RIGHT_ARROW && !actualFigura.colision('derecha')){           // Permite mover a la derecha
      actualFigura.x += escala;
    }  else if (keyCode === LEFT_ARROW && Math.round(actualFigura.x) > Math.round(escala) && !actualFigura.colision('izquierda')) {       // Permite mover a la izquierda
      actualFigura.x -= escala;
    } else if(keyCode === UP_ARROW && !actualFigura.colision('rotar')){                              // Permite rotar
      actualFigura.rotar();
    }
  }
}

function windowResized() {          // Ajustamos el tamaño de la ventana
  resizeCanvas(windowWidth, windowHeight);
}

function recargar(){                // La función de Nuevo Juego que recarga la página
  location.reload()
}

function cronometro(){              // La función que permite contar el tiempo (arriba definimos que se repite cada segundo)
  if(estapausado == 0){
    tiempo++;
  }
}

function pausaa(){                  // La función que nos permite pausar el juego
  if(estapausado == 0){
    noLoop()
    estapausado = 1;
    audio.stop() 
  } else {
    loop()
    estapausado = 0;
    audio.loop()
  }
}

function wiki(){                    // La función de Acerca que nos redirecciona a la página oficial de tetris
  window.open('https://tetris.com/about-us', '_blank').focus();
}

let plantilla = () => {             // Configuramos la plantilla inicial, dibujando la rejilla y los bordes del mapa y mostrando elementos del menú principal

  // Configuramos menú principal
  slideNiv.html(nivel)                          // Mostramos el nivel actual 
  audio.setVolume(slideVol.value());            // Definimos el ajuste del volumen con el slide
  punta.html(puntaje)                           // Mostramos el puntaje actual
  tiemp.html('Tiempo: ' + Math.floor(tiempo/60) + ' minutos ' + tiempo%60 + ' segundos.'  );          // Mostramos el tiempo de juego

  // Dibujamos el fondo y la rejilla
  background("black");                  // Definimos el fondo negro
  stroke(95);                           // El color para dibujar contornos
  strokeWeight(0.3);                    // El grosor para dibujar contornos
  noFill();                             // Ajustamos no llenar los dibujos 
  for ( let i = 1; i < col-1; i++) {    // Dibujamos la rejilla
    for ( let j = 0; j < fil-1; j++) {
      square(i * escala, j * escala, escala);
    }
  }

  // Dibujamos el piso y los muros
  fill(95);
  rect(0, larPiso, dimen, 2*escala);            // Piso
  rect(0, 0, escala, dimenp);                   // Muro izq
  rect(dimen - escala, 0, escala, dimenp);      // Muro der
};

let generaFigura = () => {          // La función que nos permite crear los objetos aleatoriamente de las fichas (actual y siguiente)

  let fl = Figuras.length;
  let cl = Coloress.length;

  if(actualFigura == 0){              // Primera vez que se ejecita la función

    let i = Math.round((Math.random() * 100)) % fl;                   // Obtenemos un número aleatorio para escoger la ficha
    let iCol = Math.round((Math.random() * 100)) % cl;                // Obtenemos un número aleatorio para escoger el color
    actualFigura = new Figura( Figuras[i], escala*Math.round(num/2) - escala, -Figuras[i][0].length*escala, Coloress[iCol]);   // Creamos la figura actual

    i = Math.round((Math.random() * 100)) % fl;         // Obtenemos un número aleatorio para escoger la ficha
    iCol = Math.round((Math.random() * 100)) % cl;      // Obtenemos un número aleatorio para escoger el color
    siguienteFigura = new Figura( Figuras[i], 504, 270, Coloress[iCol]);      // Creamos la siguiente figura
  } else {

    actualFigura = siguienteFigura;                           // Intercambiamos la que pasa a ser la actual figura
    actualFigura.x = escala*Math.round(num/2) - escala;                // Ubicamos la figura actual en el centro 
    actualFigura.y = -siguienteFigura.fig[0].length*escala;   //  Ubicamos la figura actual en lo más alto

    i = Math.round((Math.random() * 100)) % fl;         // Obtenemos un número aleatorio para escoger la ficha
    iCol = Math.round((Math.random() * 100)) % cl;      // Obtenemos un número aleatorio para escoger el color
    siguienteFigura = new Figura( Figuras[i], 504, 270, Coloress[iCol]);    // Creamos la siguiente figura
  }
};

let caer = () => {                  // La función que permite que caiga el tetromino
  if(actualFigura.colision('abajo') === false){       // Verificamos que no colisiones abajo
    actualFigura.y += escala;                 
    puntaje = Math.ceil(puntaje + (nivel+1)*(0.1))     // Aumentamos un poco el puntaje cada que caiga
  } else {
    Matrix2.forEach( (col, i) =>      // Una vez se detecta la colisión abajo guardamos la ficha que cayó en el mapa
      col.forEach ( (e, j) => {
        e ? Matrix1[i][j] = new Cuadro( (i+1)*escala, (j-1)*escala, escala, e) : null;
      }))
    generaFigura();
  }
}

function gameoverso(){
  if(estapausado == 3){
    audiofinal.play()
    estapausado++
  }
}