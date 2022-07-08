class Circle{
  constructor(x,y,vx,vy,r,c=[123,25,205]){
    this.position=new createVector(x ,y);
    this.velocity=new createVector(vx,vy);
    this.r=r;
    this.c=c;
  }
  draw(){
    this.move();
    noStroke();
    fill(this.c[0],this.c[1],this.c[2]);
    circle(this.position.x,this.position.y,this.r);
  }
  move(){
    let newposition=p5.Vector.add(this.position, this.velocity);
    if(newposition.x-this.r<0 ||newposition.x+this.r>windowWidth){
      this.velocity.x=-this.velocity.x;
    }
    if(newposition.y-this.r<0 ||newposition.y+this.r>windowHeight){
      this.velocity.y=-this.velocity.y;
    }
    this.position=p5.Vector.add(this.position, this.velocity);
  }
}