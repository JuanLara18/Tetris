// Constantes del recuadro
const phi = 1.9                         // Relacion alto/ancho
const dimen = 350;                      // Ancho en píxeles del canvas 
const dimenp = Math.floor(dimen*phi);   // Largo en píxeles del canvas
const num = 12;                         // Número de columnas
const escala = dimen/num;               // Tamaño de los cuadros
const fr = 60;                          // Frames por segundo

let Coloress = ['red', 'yellow', 'blue', 'green', 'orange', 'magenta', 'cyan'];     // Consantes de colores en una lista

// Calcular columnas y filas
const col = Math.round( dimen / escala);        // Columnas
const fil = Math.round( dimen*phi / escala);    // Filas
const larPiso = escala*(fil-1);                 // Altura del mapa

// Constantes de los tetrominos con  sus rotaciones
const la_o = [  [
                  [1, 1], 
                  [1, 1] 
                ]
              ];

const la_l = [  [
                  [1], 
                  [1],
                  [1], 
                  [1]
                ],
                [
                  [1, 1, 1, 1]
                ]
              ];

const la_s = [  [
                  [1, 0],
                  [1, 1],
                  [0, 1]
                ],
                
                [
                  [0,1,1],
                  [1,1,0]
                ]
              ];
              
const la_L = [  [
                  [1, 0], 
                  [1, 0],
                  [1, 1]
                ],

                [
                  [1, 1, 1],
                  [1, 0, 0]
                ],

                [
                  [1, 1],
                  [0, 1],
                  [0, 1]
                ],

                [
                  [0, 0, 1],
                  [1, 1, 1]
                ]
              ];

const la_t = [  [
                  [0, 1], 
                  [1, 1],
                  [0, 1]
                ],

                [
                  [0, 1, 0],
                  [1, 1, 1]
                ],

                [
                  [1, 0],
                  [1, 1],
                  [1, 0]
                ],

                [
                  [1, 1, 1],
                  [0, 1, 0]
                ]
              ];

const la_ss = [  [
                  [0, 1],
                  [1, 1],
                  [1, 0]
                ],
              
                [
                  [1,1,0],
                  [0,1,1]
                ]
            ];      
            
const la_LL = [  [
                  [0, 1], 
                  [0, 1],
                  [1, 1]
                ],

                [
                  [1, 0, 0],
                  [1, 1, 1]
                ],

                [
                  [1, 1],
                  [1, 0],
                  [1, 0]
                ],

                [
                  [1, 1, 1],
                  [0, 0, 1]
                ]
              ];

// Definimos las listas de las figuras        
let Figuras = [la_o, la_l, la_s, la_L, la_t, la_LL, la_ss];

const anc = num - 2;                          // Ancho del mapa
const lar = Math.round(larPiso/escala);       // Largo del mapa

let Matrix1 = Array(anc+1).fill().map(() => Array(lar-1).fill(null))              // Definimos la matriz que corresponderá al mapa
let Matrix2;     
let figurar;                                                                 // Definimos una matriz auxiliar

let nullcol = Array(Matrix1[0].length + 2).fill(null);                            // Definimos una columna nula
let bloquescol = Array(Matrix1[0].length + 2).fill(new Cuadro(0,0,0,'yellow'));   // Definios una columna con cuadros


// Configuramos el mapa 
Matrix1.push(bloquescol);                                     // Ponemos bloques a derecha
Matrix1.shift();                                              // Quitamos la primera columa para equilibrar el tamaño
for(let i = 0; i < Matrix1.length; i++){                      // Ponemos piso en el mapa
  Matrix1[i].unshift(null);
  Matrix1[i].push(new Cuadro(0,0,0,'yellow'));                
} 
Matrix1[anc][0] = new Cuadro(0,0,0,'yellow')