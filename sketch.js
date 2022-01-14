var rex,rex_run,rex_lose; 
var bordas;
var solo,colisaosolo;
var nuvem,imagem_nuvem;
var placar = 0;
var gobstaculos, gnuvens;
var som_jump, som_dead, som_ponto;

//PAUSAR
var JOGAR = 0;
var PAUSAR = 1;
var modo = JOGAR;

var gameover, reiniciar, gameover_img,reiniciar_img;

function preload(){
  //carregar animações e imagens
  rex_run = loadAnimation("trex1.png","trex3.png","trex4.png");
  imagemSolo = loadImage("ground2.png");

  imagem_nuvem = loadImage("cloud.png");

  rex_lose = loadImage("trex_collided.png");

  console.log("Placar: "+0);

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameover_img = loadImage("gameOver.png");
  reiniciar_img = loadImage("restart.png");

som_jump = loadSound("jump.mp3");
som_dead = loadSound("die.mp3");
som_ponto = loadSound("checkPoint.mp3");



}

function setup(){
  //adicionar sprites e etc
  createCanvas(windowWidth, windowHeight);

  //sprite rex
  rex = createSprite(50,height-100,10,10);
  //animação rex correndo
  rex.addAnimation("running",rex_run);
  rex.addAnimation("lose",rex_lose);
  rex.scale = 0.5;
  rex.x = 50;



  //solo
  solo = createSprite(width/2,height-10,width,20);
  solo.addImage("solo",imagemSolo);
  solo.x = solo.width / 2;

  colisaosolo = createSprite(width/2,height-10,width,10);
  colisaosolo.visible = false;

  gobstaculos = new Group();

  gnuvens = new Group();

  //rex.debug = true;
  rex.setCollider("circle",0,0,40);

  //bordas do jogo
  bordas = createEdgeSprites();

  gameover = createSprite(width/2,height/2);
  gameover.addImage(gameover_img);
  gameover.scale = 0.8;
  gameover.visible = false;

  reiniciar = createSprite(width/2,height/2 + 50);
  reiniciar.addImage(reiniciar_img);
  reiniciar.scale = 0.8;
  reiniciar.visible = false;


  //var rand = Math.round(random(1,100))
//console.log("numero randomico",rand);



}

function draw(){

  //funcionamento do jogo
  //console.time();
  background('white');

  text ("Placar: "+placar,width/2 +400,height-500);

  //console.log("modo: ",modo)



if(modo == JOGAR){
    //mover o solo
    solo.velocityX = -10;

    //atualizar placar
    placar = placar + Math.round(frameRate()/60);

  if(placar % 100 === 0 && placar > 0){
    som_ponto.play();
  }

    //reiniciar solo
  if (solo.x < 0){
    solo.x = solo.width/2;
  }  

   //Pulo rex
  if(touches.length > 0 &&rex.isTouching(solo)){
    som_jump.play();
    rex.velocityY = -10;
    touches = [];
  }

   //gravidade
  rex.velocityY = rex.velocityY + 0.6;

  gerarNuvens();

  gerarObstaculos();

  if(gobstaculos.isTouching(rex)){
   som_dead.play();
    modo = PAUSAR;
  }


}


else if (modo == PAUSAR){
    //parar  o solo
    solo.velocityX = 0;

  rex.changeAnimation("lose",rex_lose);
  rex.velocityX = 0;
  rex.velocityY = 0;

  gobstaculos.setLifetimeEach(-1);
  gnuvens.setLifetimeEach(-1);

  gobstaculos.setVelocityXEach(0);
  gnuvens.setVelocityXEach(0);

  gameover.visible = true;
  reiniciar.visible = true;

  if(touches.length > 0 ){
    console.log("reiniciar");
    reset();
    
     touches = [];
  }



  }

  //console.log(rex.y);
  //console.info("informar algo");
  //console.error("informar um erro");
  //console.warn("informar um aviso");
  //console.log(frameCount);


  //chão
  //rex.collide (bordas [3]);
  //rex.collide(solo);
  rex.collide(colisaosolo);




  drawSprites();
  //console.timeEnd();
}

function reset(){
  modo = JOGAR;
  gameover.visible = false;
  reiniciar.visible = false;

  gobstaculos.destroyEach();
  gnuvens.destroyEach();
  rex.changeAnimation("running",rex_run)

  placar = 0;
}

function gerarNuvens(){
  if(frameCount % 80 === 0){
  nuvem = createSprite(width+20,100,50,10);
  nuvem.addImage(imagem_nuvem);
  nuvem.y = Math.round(random(height-50,height-130));
  nuvem.scale = 0.5;
  nuvem.velocityX = -3;


    nuvem.lifetime = width+20;

    //camada ou profundidade do sprite
    //depth
    //console.log(rex.depth);
    //console.log(nuvem.depth);

    //ajustar profundidade

    nuvem.depth = rex.depth
    rex.depth = rex.depth + 1;

     gnuvens.add(nuvem);

  }


}

function gerarObstaculos(){
  if (frameCount % 60 === 0){
    var obstaculo = createSprite(width+20,height-30,10,40);
    obstaculo.scale = 0.5;
    obstaculo.velocityX = -6;
    obstaculo.lifetime = width+20;

    //gerar obstaculos aleatorios

    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
        break;
      case 2: obstaculo.addImage(obstaculo2);
        break;
      case 3: obstaculo.addImage(obstaculo3);
        break;
      case 4: obstaculo.addImage(obstaculo4);
        break;  
      case 5: obstaculo.addImage(obstaculo5);
        break;
      case 6: obstaculo.addImage(obstaculo6);
        break;   
        default: break;  
      }  

      gobstaculos.add(obstaculo);

  }

}
