class Cuadro {                  // Construimos la clase de Cuadro que serán los elementos de Figura representando los tetrominos
    constructor(x=0, y=0, tam = escala, colorr = "white"){
        this.x = x;
        this.y = y;
        this.tam = tam;
        this.color = colorr;
    }

    mostrar(){                  // Definimos la opción que nos permite mostrar los cuadros
        fill(this.color);
        stroke("black");
        strokeWeight(1);
        square(this.x, this.y, this.tam);
    }
}

class Figura{                   // Construimos la clase de Figura que representarán los tetrominos
    constructor(figura = [[]], x = 0, y = 0, colorr = "white", id = 0){
        this.id = id;
        this.figura = figura;
        this.fig = this.figura[this.id];
        this.x = x;
        this.y = y;
        this.color = colorr;

        let tamfil = this.fig.length;
        let tamcol = this.fig[0].length;

        this.forma = this.hacerFigura(tamfil, tamcol);
    }

    actualizar(){              // Nos permite actualizar la posición de los elementos como una figura sólida
        this.forma.forEach( (x,i) => 
                x.forEach ( (e,j) => 
                { if(e) {
                    e.x = this.x + j * escala; 
                    e.y = this.y + i * escala;
                    }
                }
                )
        );
    }

    hacerFigura(m, n){         // Una función que retorna la figura donde los elementos son los cuadros
        return  Array.from(new Array(m), (x,i) => // i = 0, 1, ..., m
                Array.from(new Array(n), (x,j) => // j = 0, 1, ..., n
                        this.fig[i][j] === 1 ? new Cuadro(this.x + j*escala, this.y + i*escala, escala, this.color) : null )
        );
    }

    mostrar(){                  // Nos permite mostrar el tetromino
        this.actualizar();
        this.forma.forEach( x => x.filter( j => j != null).forEach(cuadro => 
            cuadro.mostrar() 
            )
        );
    }

    rotar(){                    // Nos permite rotar la figura recorriendo this.figura
        this.id = (this.id + 1)%this.figura.length;
        this.fig = this.figura[this.id];
        this.forma = this.hacerFigura(this.fig.length, this.fig[0].length);
        this.mostrar();
    }

    posicion(){                 // Guardamos en Matrix2 el color en de los cuadros en la posición correspondiente

        Matrix2 = Array(anc+1).fill().map(() => Array(lar+1).fill(null));
        this.forma.forEach( (x,i) => 
                x.forEach ( (e,j) => 
                {
                    if(e) {
                        let posx = Math.round(this.x/escala) + j - 1;
                        let posy = Math.round(this.y/escala) + i;
                        Matrix2[posx][posy] = this.color;
                    }
                }
                )
        );
    }

    colision(texto, fich = actualFigura){       // Nos permite detectar las coliciones en 3 direcciones y al rotar
        
        let va = false;

        let Matrix3 = Array(anc+1).fill().map(() => Array(lar+1).fill(null));           // Matrix3 representa en el siguiente momento
        for (let i = 0; i < Matrix3.length; i++) {                                      // Igualamos las matrices en espacios de memoria distintos
            for (let j = 0; j < Matrix3[0].length; j++) {
                Matrix3[i][j] = Matrix2[i][j];
            }
        }

        if(texto == 'abajo'){                   // Verificamos que la colisión sea abajo
            for(let i = 0; i < Matrix3.length; i++){ // "Movemos" Matrix3 una fila 
                Matrix3[i].unshift(null);
                Matrix3[i].pop();
            }
        }

        if(texto == 'derecha'){                 // Verificamos que la colisión sea a la derecha
            Matrix3.unshift(nullcol);
            Matrix3.pop();
        }

        if(texto == 'izquierda'){               // Verificamos que la colisión a la izquierda
            Matrix3.push(nullcol);
            Matrix3.shift();
        }

        if(texto == 'rotar'){                   // Verificamos que la colisión sea al rotar
            figurar = new Figura(fich.figura, fich.x, fich.y, fich.id)                      // Cremos una figura que vamos a simular rotar y verificar si hay una colisión
            figurar.id = (figurar.id + 1) % figurar.figura.length;
            figurar.fig = figurar.figura[figurar.id];
            figurar.forma = figurar.hacerFigura(figurar.fig.length, figurar.fig[0].length);     // Acá hemos terminado de rotar la figura

            let Matrix4 = Array(anc+3).fill().map(() => Array(lar+1).fill(null));               // Creamos una matriz auxiliar para verificar la colisión
            figurar.forma.forEach( (x,i) => 
                    x.forEach ( (e,j) => 
                    {
                        if(e) {
                            let posx = Math.round(figurar.x/escala) + j - 1;
                            let posy = Math.round(figurar.y/escala) + i;
                            Matrix4[posx][posy] = true;
                        }
                    }
                )
            )
            for (let i = 0; i < Matrix3.length; i++) {                                      // Igualamos las matrices en espacios de memoria distintos
                for (let j = 0; j < Matrix3[0].length; j++) {
                    Matrix3[i][j] = Matrix4[i][j];
                }
            }
        }

        Matrix3.forEach( (col, i) => // Verificamos el choque con los elementos de Matrix1
                col.forEach ( (e, j) => {
                    if( e && Matrix1[i][j] ){
                        va = true;
                        return va;
                    }
                }
                )
            )
            return va;
    }
}