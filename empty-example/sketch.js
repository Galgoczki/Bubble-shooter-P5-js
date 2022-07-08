let w = 400;
let h = 600;
let windowOffset;
const r = 20;
let bubbleWCount;//how many Bubble can fit in a raw
let bubbleHCount;//how many Bubble can fit in a raw
let cannon;
let allBubbles=[];
let fallingBubbles = [];
let mouseIsAlreadyPressed=false;
let debugmode=false;

let bgCircles=[];
let bgCirclesNumber=100;

const collors= [[14,52,91],[93,142,193],[231,230,230],[255,192,0],[240,168,76]];
let cNumber=[0,0,0,0,0];

const randomness = 60;//the perlin noise distinse

const e = 0.001;//epsilon
const nearBoubelRange=5;
const cannonSpeed=2.5;
function getColor(i,j){
  //return floor(noise(i*randomness,j*randomness)*collors.length);
  return floor(random()*collors.length);
}
function myReset(){
  noiseSeed(random()*1000);
  //asd
  cNumber=[0,0,0,0,0];
  
  allBubbles=[];
  fallingBubbles = [];
  
  bubbleWCount=floor(w/(r*2));
  bubbleHCount=floor(h*0.6 /(r*2));
  
  cannon=new Cannon(windowOffset.x+w/2,h,cannonSpeed);
  let offset = createVector(r,sqrt((r*2)**2-(r)**2));
  for(let i =0;i<bubbleWCount;i++){
    for(let j =0;j<bubbleHCount;j++){
      let c =getColor(i,j);
      cNumber[c]++;
      if(j%2==1){
        if(i!=bubbleWCount-1){//out of the border
          let bubble= new Bubble(windowOffset.x+i*r*2+offset.x+r,j*offset.y+r,c,[],r);
          allBubbles.push(bubble);
        }
      }else{
        let bubble= new Bubble(windowOffset.x+i*r*2+r,j*offset.y+r,c,[],r);
        
        if(j==0) bubble.setStable(true);
        allBubbles.push(bubble);
      }
    }
  }
  
  allBubbles.forEach(bubble => bubble.countNeighbor());
  
}
function setup() {
  alert("left click =shoot \n wheel and right click swap");
  createCanvas(windowWidth, windowHeight);
  windowOffset= new createVector(windowWidth/2-w/2,0);
  button = createButton('reset');
  let buttonSize=new createVector(150,75);
  button.position(0+windowOffset.x+w/2-buttonSize.x/2, h+10+windowOffset.y);
  button.size(buttonSize.x,buttonSize.y);
  button.style("font-family", "Bodoni");
  button.style("font-size", "48px");
  button.mousePressed( _ => myReset());
  
  noiseSeed(random()*1000)
  
  bubbleWCount=floor(w/(r*2));
  bubbleHCount=floor(h*0.6 /(r*2));
  
  cannon=new Cannon(windowOffset.x+w/2,h,cannonSpeed);
  let offset = createVector(r,sqrt((r*2)**2-(r)**2));
  for(let i =0;i<bubbleWCount;i++){
    for(let j =0;j<bubbleHCount;j++){
      let c =getColor(i,j);
      if(j%2==1){
        if(i!=bubbleWCount-1){//out of the border
          let bubble= new Bubble(windowOffset.x+i*r*2+offset.x+r,j*offset.y+r,c,[],r);
          allBubbles.push(bubble);
        }
      }else{
        let bubble= new Bubble(windowOffset.x+i*r*2+r,j*offset.y+r,c,[],r);
        
        if(j==0) bubble.setStable(true);
        allBubbles.push(bubble);
      }
    }
  }
  allBubbles.forEach(bubble => bubble.countNeighbor());
  //
  //background setup
  //
  for(let i =0;i<bgCirclesNumber;i++){
    let circleRadius=floor(random()*50)+50;
    let vnorm=p5.Vector.random2D();
    bgCircles.push(new Circle(floor(random()*(windowWidth-circleRadius-1))+1,
                   floor(random()*(windowHeight-circleRadius-1))+1,
                   vnorm.x,vnorm.y,circleRadius,
                  [floor(random()*255),floor(random()*255),floor(random()*255)]));
  }
  
}

let =[];
let  = [];
function draw() {
  background(255,255,255);
  //draw bg
  
  bgCircles.forEach(item => item.draw());
  
  
  //draw game
  fill(220,110,0);
  strokeWeight(3);
  stroke(0)
  rect(windowOffset.x,0,w,h);
  noStroke();
  
  if (mouseIsPressed === true &&
      mouseX >0+windowOffset.x &&
      mouseY >0+windowOffset.y &&
      mouseX <w+windowOffset.x &&
      mouseY <h+windowOffset.y ) {
    if(mouseIsAlreadyPressed===false){
    mouseIsAlreadyPressed=true;
    if (mouseButton === LEFT) {
      cannon.shoot();
    }
    if (mouseButton === RIGHT  || mouseButton === CENTER) {
      cannon.swapBubbles();
    }
    if (mouseButton === CENTER && debugmode) {
      let nearest = null;
      let nearestDistance=null;
        for(let i = 0; i < allBubbles.length; i++){
          if(nearest===null){
            nearest=allBubbles[i];
            nearestDistance=sqrt((allBubbles[i].position.y-mouseY)**2 + 
                  (allBubbles[i].position.x-mouseX)**2);
          }
          if(sqrt((allBubbles[i].position.y-mouseY)**2 + 
                  (allBubbles[i].position.x-mouseX)**2) < nearestDistance){
            nearestDistance=sqrt(
              (allBubbles[i].position.y-mouseY)**2 + 
              (allBubbles[i].position.x-mouseX)**2);
            nearest=allBubbles[i];
            
          }
        }
      console.log(nearest);
    }
    }
  }
  if(mouseIsAlreadyPressed===true &&mouseIsPressed === false){
    mouseIsAlreadyPressed=false;
  }
  fallingBubbles.forEach(function(bubble){
    bubble.setPosition(bubble.position.x,bubble.position.y+5);
    bubble.draw();
    if(bubble.position.y+10-bubble.r>h){
      let temperarly=[];
      for(let i = 0; i < fallingBubbles.length; i++){
        if(fallingBubbles[i]!=bubble)temperarly.push(bubble);
      }
      fallingBubbles=temperarly;
    }
  });
  allBubbles.forEach(bubble => bubble.draw());
  cannon.draw();
  cannon.update();
  
  fill(0);
  noStroke();
  textSize(r);
  text(
    str(min(max(mouseX-windowOffset.x,0),w))+" : "+
    str(min(max(mouseY-windowOffset.y,0),h)),5+windowOffset.x,h-5+windowOffset.y);
  
  if(allBubbles.length==0 && fallingBubbles.length==0){

    fill(110,220,30);
    strokeWeight(3);
    stroke(0)
    rect(windowOffset.x+w/4,h/2,w/2,h/8);
    noStroke();

    fill(0);
    noStroke();
    textSize(r);
    text("Nyertél!",windowOffset.x+w/4-30+w/4,h/2+h/16+5);
    noLoop();
  }
}