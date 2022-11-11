# PROYECTO DE INVESTIGACIÓN DE PMUD
## _MARIO BROS CON CREATEJS_

[![N|Solid](https://www.upc.edu/comunicacio/ca/identitat/descarrega-arxius-grafics/fitxers-marca-principal/upc-positiu-p3005.png)](https://www.epsevg.upc.edu/ca/escola)


Proyecto de investigación de la asignatura de PMUD, EPSEVG-UPC.

- Autor: Mario Kochan
- Fecha: 18/11/2022
- Profesor: Jordi Estve

## Características

- Proyecto realizado con [JavaScript] y [HTML]
- Uso de [GITHUB]
- Uso de terminal UNIX
- Creación del .md con [Dillinger](https://dillinger.io/)
- Uso de [CreateJS], que dentro de este se usó: [EaselJS], [TweenJS] y [SoundJS]

## Despliegue y uso de CreateJS

[CreateJS] es un conjunto de librerías que nos permite realizar diferentes modificaciones a los objetos HTML presentes en nuestra página web. Esta librería nos permite hacer videojuegos para navegador, que es lo que haremos en este trabajo de investigación. Descubriremos como funciona un Game engine de este tipo, viendo sus debilidades y sus puntos fuertes. 
Aparte de la memoria redactada aquí, también está hecho el siguiente [PowerPoint]() presentado en clase.

### Instalación

Para poder usar la librería CreateJS, primer crearemos un [index.html](https://github.com/ShadowFurtive/mariobros_createjs/blob/main/index.html) en el cual inicilizaremos la librería de JavaScript y el archivo .js principal.

```sh
        <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
        <script src="main.js"></script>
```

A continuación, crearemos el canvas sobre cual trabajaremos y indicamos que el cargar el body se cargue la función init() que está inicializada en nuestro [main.js](https://github.com/ShadowFurtive/mariobros_createjs/blob/main/main.js).
```sh
    <body onload="init()">
        <canvas id="gameCanvas" width="600" height="300"  style="display: block; margin: 0 auto;">
        </canvas>
    </body>
```
**CUIDADO:**
Para poder abrir nuestro index.html, primero deberemos crear nuestor main.js. Una vez creado nuestro main.js, el index.html se podrá abrir creando un servidor local que escuche por algun puerto. Esto se puede hacer con python. Dentro de la carpeta donde está el index.html, llamamos a esta comanda de python:
```sh
python3 -m http.server
```

### main.js

El [main.js](https://github.com/ShadowFurtive/mariobros_createjs/blob/main/main.js) es un archivo bastante extenso de diferentes funciones agrupadas. Tenemos primero el init(), que es la función encargada de inicializar todo. Dentro del init() podemos ver como se inicializa el escenario, los framerates y como se cargan las sheets de los elementos de este. Además de eso, usamos la libreria [SoundJS] para cargar la música principal de nuestra copia de Mario Bros. 

Inicialización del escenario con la música:
```sh
    stage = new createjs.Stage("gameCanvas");

    // Añadimos framerate 
    createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate=60;
    // Añadimos evento para actualizar cada tick
    createjs.Ticker.addEventListener("tick", stage);

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", music_loader);
    createjs.Sound.registerSound("/musica/ost.ogg", "/musica/");
```
Inicialización de los sheets del escenario:
```sh
  var manifest = [
            { "src": "mario.png", "id": "mario" },
            { "src": "nube.png", "id": "nube"},
            { "src": "bloque.png", "id": "bloque"},
            { "src": "suelo.png", "id": "suelo"},
            { "src": "bicho.png", "id": "tortuga"},
            { "src": "bicho_2.png", "id": "tortuga2"},
            { "src": "tubo.png", "id": "tubo"},
            { "src": "bloque_incognito.png", "id": "bloque_incognito"},
            { "src": "bloque_incognito_cambiado.png", "id": "bloque_cognito"},
            { "src": "saul_goodman.png", "id": "saul_goodman"},
            { "src": "meme.png", "id": "meme"}
        ];
        loader = new createjs.LoadQueue(true);
        // añadimos evento para cargar imagenes.
        loader.addEventListener("complete", handleComplete);
        loader.loadManifest(manifest, true, "./img/");
```
Una vez cargados los elementos del escenario, se ejecuta la función handleComplete que se encargará de llamar a diferentes funciones para colocar cada elemento en su escenario correspondiente:

```sh
    function handleComplete(){
        createSuelo();
        createNubes();
        createTubo();
        createBloques();
        createMario();
        createTortuga();
        createjs.Ticker.addEventListener("tick", checkCollision)
        createjs.Ticker.addEventListener("tick", tick);
    }
```
Para ejecutar los diferntes sonidos que tenemos cargados, debemos llamar a funciones que se encarguen de reproducir las canciones que se le pasen por el parámetro event:
```sh
    var musica_de_fondo;
    function music_loader(event) {
        musica_de_fondo = createjs.Sound.play(event.src);
        musica_de_fondo.volume = 0.5;
    }
    
    function end_loader(event) {
        createjs.Sound.removeSound("/musica/ost.ogg");
        let instance = createjs.Sound.play(event.src);
        instance.volume = 0.5;
    }
    
    function sorpresa_loader(event){
        let instance = createjs.Sound.play(event.src);
        instance.volume = 0.5;
    }
```
A continuación tenemos el sistema de físicas del juego. Es algo muy básico: Tratamos cada objeto como un conjunto de puntos que crean un rectangulo de diferentes formas. Generamos, de 2 formas diferentes, una bloque de códigos que saltan en el momento que 2 espacios de coordenadas de diferentes bloques coinciden. En la función **checkCollision()**, se puede ver como se comprueban de las dos formas difernetes si dos objetos están colisionando. 
- Tenemos el ejemplo del objeto mario con el tubo, que en caso de coincidir sus espacios, tratamos de adaptar mario al terreno. 
```sh
    if(detect_object_collision(mario,tubo)){
        if(mario.y != tubo.y-tubo.image.height ){
            if(tubo.x > mario.x) poder_avanzar_xder=false;
            if(tubo.x < mario.x) poder_avanzar_xizq=false;
            if(mario.y < tubo.y - tubo.image.height/2){
                mario.y = tubo.y-tubo.image.height;
                createjs.Tween.get(mario, {override:true}).to({y: mario.y}, 300, createjs.Ease.linear())
            }
        }
        else{
            if(!poder_avanzar_xder)
            poder_avanzar_xder=true;
            if(!poder_avanzar_xizq)
            poder_avanzar_xizq=true;
        }
    }
    else{
        if(mario.y == tubo.y-tubo.image.height){
            mario.y = 200-mario.image.height/2;
            createjs.Tween.get(mario, {override:true}).to({y: mario.y}, 300, createjs.Ease.linear())
        }
        if(!poder_avanzar_xder)
        poder_avanzar_xder=true;
        if(!poder_avanzar_xizq)
        poder_avanzar_xizq=true;
    }
```
- Tenemos el ejemplo del objeto mario con el bicho, que en caso de coincidr sus espacios, finaliza la partida. 
```sh 
    var leftX= mario.x - mario.regX + 5;
    var leftY= mario.y - mario.regY + 5;
    var points = [
        new createjs.Point(leftX, leftY),
        new createjs.Point(leftX + mario.image.width-10, leftY),
        new createjs.Point(leftX, leftY + mario.image.height-10),
        new createjs.Point(leftX + mario.image.width-10, leftY+mario.image.height-10)
    ];
   for(var i=0; i<points.length; i++){
        var objects = stage.getObjectsUnderPoint(points[i].x, points[i].y);
        if(objects.filter((object)=>object.name == "tortuga").length > 0){
            gameOver();
            return;
        }
    }
```
Para mover el personaje, hacemos uso de la funcion **keydown event**, que es una función del propio [JavaScript] que nos permite reaccionar ante el accionamiento de una tecla:
```sh
    var keypress=true;
    document.addEventListener("keydown", (event) => {
        if(!endgame){
            switch(event.key){
                case 'd' || 'ArrowRight':
                    mario.scaleX = 1;
                    right=true
                    createjs.Ticker.addEventListener("tick", tick_mario);
                    break;
                case 'a' || 'ArrowLeft':
                    mario.scaleX = -1;
                    right=false
                    createjs.Ticker.addEventListener("tick", tick_mario);
                    break;
                case ' ':
                    if (keypress == true){
                        keypress=false;
                        pos_inicial_y=mario.y;
                        if(mario.x>bloque_incognito.x-5 && mario.x-5<bloque_incognito.x+bloque_incognito.image.width){
                            createjs.Tween.get(mario).to({y: 5+bloque_incognito.y+bloque_incognito.image.height}, 150, createjs.Ease.linear()).to({y: 200-mario.image.height/2}, 300, createjs.Ease.linear());
                            create_saul_goodman();
                        }
                        else{
                            createjs.Tween.get(mario).to({y: mario.y-60}, 300, createjs.Ease.linear()).to({y: 200-mario.image.height/2}, 300, createjs.Ease.linear());
                        }
                        setTimeout(()=>{
                            keypress=true;
                        }, 600)
                    }
                    break;
            }
    }
});
```
Como se puede ver, aquí hacemos uso de la librería [TweenJS] para realizar la animación del salto de Mario.

Por último, tenemos la función **GameOver**, que cuando se llama se congela el juego y se da por entendido que ha finalizado:

```sh
    function gameOver(){
        createjs.Tween.removeAllTweens();
        createjs.Ticker.removeEventListener("tick", checkCollision);
        createjs.Ticker.removeEventListener("tick", tick);
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.addEventListener("fileload", end_loader);
        createjs.Sound.registerSound("/musica/death.ogg", "/musica/");
        endgame=true;
    }
```

### Sheets
Dentro de la carepta [/img](https://github.com/ShadowFurtive/mariobros_createjs/tree/main/img) se pueden ver los sheets usados para crear el escenario. Además, en [/sheets](https://github.com/ShadowFurtive/mariobros_createjs/tree/main/sheets) se pueden ver los sheets completos. 
Para editar los sheets, se ha hecho uso de la página web [ezgif](https://ezgif.com/)
### Música
Dentro de la carpeta [/musica](https://github.com/ShadowFurtive/mariobros_createjs/tree/main/musica) están los sonidos usados para hacer el videojuego. He usado un convertidor online de youtube a ogg para obtener los archivos.

### Curiosidad
Como _meme_ para la demostración, el bloque sorpresa hace una cosa distinta a lo que suele hacer. Esta hecho a próposito. 

### Fotos ingame

![N!SOLID](https://lh3.googleusercontent.com/i00L7tL7gbr40LtNy_EzFINZhlC8ORpxbRlDeFsvZVV0UNOASQg2W40zgqfVMnTjf1zEYU2TW3jEGwZMv2K9VBQcki3CLVzH4j9uaxLINy4LVcLJ1MZhrHPMEEiBKU8eGxuRxZXt5k-elcR9o0M9gGs4tRJfZx9tR7CQpGHJDFq9sV6Ly6LfS6NGM862ntOrqAd1WBgBBut3RFqevj75Rp8_t4SMemucAJUKob6h24AJUe54_JamhcuyLaliz5YkbWG2KYniq2kSsCShTyy-eCNtjRgISP4xlzluk61LFt7OAaqqXUOOUnyWfSL2_-dvlSH16Vk6IT1guCLAPhhS_rS6L5dcb3LQD-0T_2J-kr8eaq2yS0NjS8eIZ_HI49bOHhSy5rF3ckfJd0KI0dhqLx2SUCRWlQdrnLQXBMcRw3JCcWfaitlsU9vQ_ir7PGwG3ML3FLkwDKq1RHsf2ngM4p6uKb8HXzuezV2bRzAO6oBxVmO_6krNLMDRGFaqUYq5At6RP3Krv3B8dsclPBu81-07c3IzLZnqZ7cznDnUQr4KlFGytOb57J9x3LI5dfH6TfqV8O6rknF4vh-lbz_IKDysIIy3ES_pmmC-GnBofQhQjKyh8D2r_H8G6DXxKePSZttkvgK34yL9kVguS4wtiF9FbXl-tLkgaqMRFSzq29Z2FfV_RV3IAZAQdfWopJ_4uOQ46L76YoF6B-Ut7jXxYCyBbsNKBFIuSz6SL-O9vCGu_bIRkQJqnEYsleuoc2z_PXaoLZOhy_KN-8Z_6iF-dABFzRmQKk5iic4AYJMG3OgesRZbgKoHhze62YY9y6GEIKt815Hkimd8WSRe8lS8D1f0F8497bXQq7yS8gK7LL8cT7gdOTfJEV7h53YLskDJ7qO75JL8wl0QV8gkJBE4uB7AUls8tiTVsrHK0HeU2i9GFDIOZCwRIyxyVHqSWiFYO0Ma1v-kiZ1oBbnZTA=w611-h314-no?authuser=1)
![N|SOLID](https://lh3.googleusercontent.com/x1zlNHO4tcVYUq8C8ozj2T3EJYqxWRlTUWzzJ2y9SK3LncQ1UkrZWPl3wl_nKUCdkUYqaJD2gScDkL_ILrXNsOL46o_-Ww2teoJucFJicJYSbXxKSnUuZTGewx3EBCO7uPMlpDl1Y7dhCa_i8YZPtV5kLNur_1qICl1_-B9clZj0ZK4zGW8OKSTkF1VRqMI4xRxtXtTA_Tl96iY0nyCzLwrtlhL-FAMtgX6nSspzFWGXEklPGuORqrQlrLIR6jA5zuj9mh3Abx9NMpoGxFy_tb053ZAezTGgImgEsawzMdns1E8weShuOU2NWlHnq52tEhnQfz5vTIX3sAY95PyjCwUU150A9cm7XvGTmr_blZbqIu9XZMhvxZT9ub-VRNO3hxtJKmByW8VGYcp-vM5cEYyIELiJub572mfY2mH2C1eeSw-uQbfUj51w9HR091Efl_qHHiMhKKwtq7LMjof0F-dlVtCr4QLeFWlLJpKOqlt4v7LPh48XL0dE51NP3CR7MZPPuiYpCGanod1jGTqzvHdQdj9kMi6U9cqy-gmGc-bWtoSVNBFeo5ZcNG4BXBjroSQCkKNyU82LmTMtHrx_3p_mEy3tAk4mzHQEmcVmFJK4Rkfk1U8utSmb4aEu8tBjR7Uy-z44BHSR2AuUNpaI_qwOr7FJqS-xdDbTbN5E3zx23Y9uYKi5hZzmdqHWLuqlmxkMuBi8QRMX2jWhy1eiObBqZVmx_y-msAAqo76Qmypzi1T45owpJlqGnsNDSH3mYUzlQvZpzQU25-rLr9tNucjmMuTbT6B-ksgKSJxGEBBuioEMDZfL6dWJ2A2ftkxC9PZb0IG8vkUwlW6xNYujApbyiFQmzBAG7SDbomdQYv1yvfIzXvvSdZzmM9WR51A1IMfebPhc0eCdA8a3GfmZ_TlXYOXCIALMRW-K4K55JaldZne33vUC90mJQGWWstsRXrr3krHsT6ZInvymjA=w612-h313-no?authuser=1)

   [GITHUB]: <https://github.com/>
   [JavaScript]: <https://www.javascript.com/>
   [HTML]: <https://www.w3schools.com/html/>
   [CreateJS]: <https://createjs.com/>
   [EaselJS]: <https://createjs.com/easeljs>
   [TweenJS]: <https://createjs.com/tweenjs>
   [SoundJS]: <https://createjs.com/soundjs>

