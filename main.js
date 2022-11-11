var stage, loader, mario, tubo, bloque_incognito, saul_goodman, meme;
var polygon, animation;
var endgame=false, volviendo = false;
var right, poder_avanzar_xder=true, poder_avanzar_xizq=true;
var pos_inicial_y = 0;
function init() {
    // Stage without webgl, stagegl with webgl 
    // webgl -> better perfomance, you need to cast everything. 
    stage = new createjs.Stage("gameCanvas");

    // Añadimos framerate 
    createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate=60;
    // Añadimos evento para actualizar cada tick
    createjs.Ticker.addEventListener("tick", stage);

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", music_loader);
    createjs.Sound.registerSound("/musica/ost.ogg", "/musica/");
        
    var background = new createjs.Shape();
    background.graphics.beginFill("#000000").drawRect(0,0,600, 300);
    stage.addChild(background);
    let welcome_init = new createjs.Bitmap("./img/welcome.png");
    welcome_init.regX=welcome_init.image.width/2;
    welcome_init.regY=welcome_init.image.height/2;
    welcome_init.y = stage.canvas.height/2;
    welcome_init.x = 50;
    stage.addChild(welcome_init);
    stage.update();
    setTimeout(()=>{
        stage.removeChild(welcome_init);
        background.graphics.beginFill("#6185F8").drawRect(0,0,600, 300);
        background.x=0;
        background.y=0;
        background.name="cielo";
        // si ponemos stage, no hace falta poner esto pero el performance es peor
        background.cache(0,0,600,300);
        
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
    }, 6000);
}

function handleComplete(){
    createSuelo();
    createNubes();
    createTubo();
    createBloques();
    createMario();
    createTortuga();
    createjs.Ticker.addEventListener("tick", checkCollision)
    createjs.Ticker.addEventListener("tick", tick);
    polygon = new createjs.Shape();
    stage.addChild(polygon)
    
}


var musica_de_fondo;
function music_loader(event) {
    // This is fired for each sound that is registered.
    musica_de_fondo = createjs.Sound.play(event.src);
    musica_de_fondo.volume = 0.5;
}


function end_loader(event) {
    // This is fired for each sound that is registered.
    createjs.Sound.removeSound("/musica/ost.ogg");
    let instance = createjs.Sound.play(event.src);
    instance.volume = 0.5;
}


function sorpresa_loader(event){
    let instance = createjs.Sound.play(event.src);
    instance.volume = 0.5;
}


function createBloques(){
    var aux = new createjs.Bitmap(loader.getResult("bloque"));
    let size_bloque=aux.image.width;
    bloques = [];
    for(let i=0; i<5; i++){
        bloques.push(new createjs.Bitmap(loader.getResult("bloque")));
        bloques[i].x=125+size_bloque*i;
        bloques[i].y=150;
        bloques[i].name="bloques";
        stage.addChild(bloques[i]);
    }
    for(let i=5; i<10; i++){
        bloques.push(new createjs.Bitmap(loader.getResult("bloque")));
        bloques[i].x=325+size_bloque*i;
        bloques[i].y=150;
        bloques[i].name="bloques";
        stage.addChild(bloques[i]);
    }
    bloque_incognito = new createjs.Bitmap(loader.getResult("bloque_incognito"));
    bloque_incognito.x = stage.canvas.width/2-bloque_incognito.image.width/2;
    bloque_incognito.y = tubo.y - tubo.image.height*2 - bloque_incognito.image.height;
    stage.addChild(bloque_incognito);
    stage.update();
}


function createTubo(){
    tubo = new createjs.Bitmap(loader.getResult("tubo"));
    tubo.regX=tubo.image.width/2;
    tubo.regY=tubo.image.height/2;
    tubo.y = 200-tubo.image.height/2;
    tubo.x = stage.canvas.width/2;
    tubo.name = "tubo";
    stage.addChild(tubo);
    stage.update();
}


function createSuelo(){
    var blocs = [];
    var aux = new createjs.Bitmap(loader.getResult("suelo"));
    let size_bloque=aux.image.width;
    let size_bloque_altura=aux.image.height;
    let total_bloques_anchura=stage.canvas.width/size_bloque;
    let total_bloques_altura=(stage.canvas.height-200)/size_bloque_altura;
    for(let i=0; i<total_bloques_anchura; i++){
        for(let j=0; j<total_bloques_altura; j++){
        blocs.push(new createjs.Bitmap(loader.getResult("suelo")));
        }
    }
    let i=0;
    let valorMul=0;
    while(i<blocs.length){
        let j=0;
        valor_x=size_bloque*valorMul;
        while(j<total_bloques_altura){
            blocs[i].x=valor_x;
            blocs[i].y=200+size_bloque_altura*j;
            stage.addChild(blocs[i]);
            i+=1;
            j+=1;
        }
        valorMul+=1;
    }
    stage.update();
}


function createNubes(){
    var nubes = [];
    for(let i=0; i<4; i++){
        nubes.push(new createjs.Bitmap(loader.getResult("nube")));
    }
    
    for(let i=0; i<nubes.length; i++){
        var directionMultiplier = i % 2 == 0 ? -1: 1;
        nubes[i].x=stage.canvas.width/2+directionMultiplier*200;
        nubes[i].y=5+i*30;
        var originalX = nubes[i].x;
        createjs.Tween.get(nubes[i], {loop: true})
        .to({x: nubes[i].x - (200*directionMultiplier)}, 3000, createjs.Ease.getPowInOut(1))
        .to({x: originalX }, 3000, createjs.Ease.getPowInOut(1));
        stage.addChild(nubes[i]);
    }
    stage.update();
}


function createMario(){
    mario = new createjs.Bitmap(loader.getResult("mario"));
    mario.regX=mario.image.width/2;
    mario.regY=mario.image.height/2;
    mario.y = 200-mario.image.height/2;
    mario.x = 50;
    stage.addChild(mario);
    stage.update();
}


function createTortuga(){
    tortuga = new createjs.Bitmap(loader.getResult("tortuga"));
    var spriteSheet = new createjs.SpriteSheet({  
        framerate: 1,  
        "images": [loader.getResult("tortuga"), loader.getResult("tortuga2")],
        "frames": {width:tortuga.image.width, height:tortuga.image.height, count:20, regX: tortuga.image.width/2, 
        regY:tortuga.image.height/2, spacing:0, margin:0},
        "animations": {
            "run": [0, 1, "run", 1.5]
        }
    })
    animation = new createjs.Sprite(spriteSheet, "run");
    animation.y = 200-tortuga.image.height/2;
    animation.x = 550;
    animation.name="tortuga"
    stage.addChild(animation);
    stage.update();
}


function create_saul_goodman(){
    bloque_incognito = new createjs.Bitmap(loader.getResult("bloque_cognito"));
    bloque_incognito.x = stage.canvas.width/2-bloque_incognito.image.width/2;
    bloque_incognito.y = tubo.y - tubo.image.height*2 - bloque_incognito.image.height;
    stage.addChild(bloque_incognito);
    stage.update();
    saul_goodman = new createjs.Bitmap(loader.getResult("saul_goodman"));
    saul_goodman.x = -200;
    saul_goodman.y = -200;
    saul_goodman.regX=saul_goodman.image.width/2;
    saul_goodman.regY=saul_goodman.image.height/2;
    stage.addChild(saul_goodman);
    meme = new createjs.Bitmap(loader.getResult("meme"));
    meme.x = 500;
    meme.y = -100;
    meme.regX=meme.image.width/2;
    meme.regY=meme.image.height/2;
    stage.addChild(meme);
    createjs.Sound.removeSound("/musica/ost.ogg");
    setTimeout(()=>{
        if(mario.scaleX==1) mario.scaleX = -1;
        else mario.scaleX=1;
        right = !right
        createjs.Ticker.addEventListener("tick", tick_mario);
    }, 2000);
    setTimeout(()=>{
        if(mario.scaleX==1) mario.scaleX = -1;
        else mario.scaleX=1;
        right = !right
        createjs.Ticker.addEventListener("tick", tick_mario);
    }, 4000);
    setTimeout(()=>{
    createjs.Sound.addEventListener("fileload", sorpresa_loader);
    createjs.Sound.registerSound("/musica/musica_esp.ogg", "/musica/");
    }, 6000)
    setTimeout(()=>{
        createjs.Tween.get(saul_goodman).to({y: stage.canvas.height/2, x: stage.canvas.width/2}, 10000, createjs.Ease.linear());
    }, 9000)
    setTimeout(()=>{
        createjs.Tween.get(meme).to({y: 50}, 5000, createjs.Ease.linear());
    }, 19000)                    
}


function tick(event) {
    if(animation.x > stage.canvas.width/2+20 && !volviendo) animation.x = animation.x - 1
    else if(volviendo){
        if(animation.x < 550) animation.x = animation.x + 1
        else volviendo = false;
    }
    else volviendo=true;

	stage.update(event);
}


function tick_mario(event) {
    if(right){
        if ((mario.x + mario.image.width < stage.canvas.width - mario.image.width) && poder_avanzar_xder) mario.x = mario.x+5;
    }
    else{
        if ((mario.x - mario.image.width > mario.image.width) && poder_avanzar_xizq) mario.x = mario.x-5;
    }  
    createjs.Ticker.removeEventListener("tick", tick_mario);
	stage.update(event);
}


function checkCollision(){
    var leftX= mario.x - mario.regX + 5;
    var leftY= mario.y - mario.regY + 5;
    var points = [
        new createjs.Point(leftX, leftY),
        new createjs.Point(leftX + mario.image.width-10, leftY),
        new createjs.Point(leftX, leftY + mario.image.height-10),
        new createjs.Point(leftX + mario.image.width-10, leftY+mario.image.height-10)
    ];
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
    for(var i=0; i<points.length; i++){
        var objects = stage.getObjectsUnderPoint(points[i].x, points[i].y);
        if(objects.filter((object)=>object.name == "tortuga").length > 0){
            gameOver();
            return;
        }
    }
}


function detect_object_collision(obj1, obj2) {
    if (obj1.visible && obj2.visible) {
        obj1.setBounds(obj1.x, obj1.y, obj1.image.width, obj1.image.height);
        obj2.setBounds(obj2.x, obj2.y, obj2.image.width, obj2.image.height);
        obj1 = obj1.getBounds();
        obj2 = obj2.getBounds();
        return !(
            ((obj1.y + obj1.height) < (obj2.y)) ||
            (obj1.y > (obj2.y + obj2.height)) ||
            ((obj1.x + obj1.width) < obj2.x) ||
            (obj1.x > (obj2.x + obj2.width/2))
        );
    } else {
        return false;
    }
}


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


function gameOver(){
    createjs.Tween.removeAllTweens();
    createjs.Ticker.removeEventListener("tick", checkCollision);
    createjs.Ticker.removeEventListener("tick", tick);
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", end_loader);
    createjs.Sound.registerSound("/musica/death.ogg", "/musica/");
    endgame=true;
 }

