const cannonBubbleOffsetFirst=+r*3;
const cannonBubbleOffsetSecund=+r*5.5;

class Cannon{
  constructor(x,y,speed,w=60,h=20){
    this.position=createVector(x,y-h);
    this.w=w;
    this.h=h;
    this.bubbles=[new Bubble(this.position.x+cannonBubbleOffsetFirst,
                             this.position.y,
                             floor(random()*collors.length),
                             [],r),
                  new Bubble(this.position.x+cannonBubbleOffsetSecund,
                             this.position.y,
                             floor(random()*collors.length),
                             [],r)]
    this.shootBubble=null;
    this.speed=speed;
    this.vmouse = createVector(mouseX-this.position.x, mouseY-this.position.y)
  }
  update(){
    this.bubbles[0].draw();
    this.bubbles[1].draw();
    if(this.shootBubble===null || !this.shootBubble.isMove()){
      return;
    }
    this.shootBubble.move();
  }
  
  draw(){
    fill(0)
    rect(this.position.x-this.w/2, this.position.y, this.w, this.h);
    strokeWeight(1);
    stroke(51);
    this.vmouse.x=mouseX-this.position.x;
    this.vmouse.y=-abs(mouseY-this.position.y);
    this.vmouse.normalize();
    this.vmouse.mult(20);
    line(this.position.x,
         this.position.y,
         this.position.x+this.vmouse.x,
         this.position.y+this.vmouse.y
        );
  }
  
  shoot(){
    //guard(s)
    if(this.shootBubble != null){
      if(this.shootBubble.isMove()){
        return;
      }
    }
    this.bubbles[0].setPosition(this.position.x,this.position.y);
    this.bubbles[1].setPosition(this.position.x+cannonBubbleOffsetFirst,this.position.y);
    this.shootBubble=this.bubbles.shift();
    this.bubbles.push(new Bubble(this.position.x+cannonBubbleOffsetSecund,
                                 this.position.y,
                                 floor(random()*collors.length),
                                 [],r));
    allBubbles.push(this.shootBubble);
    let a = createVector(this.vmouse.x,this.vmouse.y).normalize().mult(this.speed);
    this.shootBubble.setVector(a.x,a.y);
  }
  swapBubbles(){
    //
    // general method to swap to item
    //
    let temporary   = this.bubbles[0];
    this.bubbles[0] = this.bubbles[1];
    this.bubbles[1] = temporary;
    //
    // update the positions
    //
    this.bubbles[0].setPosition(this.position.x+cannonBubbleOffsetFirst,
                                this.position.y);
    this.bubbles[1].setPosition(this.position.x+cannonBubbleOffsetSecund,
                                this.position.y);
    
  }
}