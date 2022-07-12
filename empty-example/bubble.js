class Bubble {
  constructor(x, y, color, neighbor, r = 15, stable = false) {
    this.position = createVector(x, y);
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    this.color = color;
    this.stable = stable;
    if (neighbor != null && Array.isArray(neighbor)) {
      this.neighbor = neighbor;
    } else {
      this.neighbor = [];
    }
    this.visited = false; //test
  }
  drawVectorLine(x, y, vx, vy) {
    stroke(51);
    fill(255, 204, 0);
    line(x, y, vx, vy);
  }
  setVector(vx, vy) {
    this.vx = vx;
    this.vy = vy;
  }
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }
  setStable(stable) {
    this.stable = stable;
  }
  move() {
    for (let i = 0; i < allBubbles.length; i++) {
      if (allBubbles[i] === this) continue;
      if (
        sqrt(
          (allBubbles[i].position.y - this.position.y) ** 2 +
            (allBubbles[i].position.x - this.position.x) ** 2
        ) <=
        allBubbles[i].r + this.r - e
      ) {
        for (let i = 0; i < allBubbles.length; i++) {
          if (allBubbles[i] === this) continue;
          if (
            sqrt(
              (allBubbles[i].position.y - this.position.y) ** 2 +
                (allBubbles[i].position.x - this.position.x) ** 2
            ) <=
            allBubbles[i].r + this.r + e + nearBoubelRange
          ) {
            this.neighbor.push(allBubbles[i]);
            allBubbles[i].neighbor.push(this);
          }
        }
        this.vx = 0;
        this.vy = 0;

        this.destroySameNeighbors();
        return false; //continues false
      }
    }
    if (this.position.y + this.vy - this.r < 0 + windowOffset.y) {
      this.vx = 0;
      this.vy = 0;
      this.stable = true;
      return false; //continues false
    }
    if (
      this.position.x + this.vx + this.r > w + windowOffset.x ||
      this.position.x + this.vx - this.r < 0 + windowOffset.x
    ) {
      this.vx *= -1;
    }
    if (debugmode)
      this.drawVectorLine(
        this.position.x,
        this.position.y,
        this.position.x + this.vx * 10,
        this.position.y + this.vy * 10
      );
    this.position.x += this.vx;
    this.position.y += this.vy;
  }

  isMove() {
    if (this.vx != 0 || this.vy != 0) return true;
    return false;
  }

  destroySameNeighbors() {
    let visited = [this];
    let next = this.neighbor;
    let needToDestroy = [];
    let nextIteration = [];
    while (next.length != 0) {
      nextIteration = []; //break;
      for (let bubbleIndex = 0; bubbleIndex < next.length; bubbleIndex++) {
        visited.push(next[bubbleIndex]);
        //
        //first for loop:look the current iterations items and investigate the neighbors
        //
        if (next[bubbleIndex].color == this.color) {
          //
          //if its not the same color
          //than we didnt need to continue this root
          //
          for (
            let nextBubbleIndex = 0;
            nextBubbleIndex < next[bubbleIndex].neighbor.length;
            nextBubbleIndex++
          ) {
            let isVisited = false;
            for (
              let visitedBubbleIndex = 0;
              visitedBubbleIndex < visited.length;
              visitedBubbleIndex++
            ) {
              //
              //in this step we didn't count on the color,just update the tabels
              //
              if (
                next[bubbleIndex].neighbor[nextBubbleIndex] ===
                visited[visitedBubbleIndex]
              ) {
                //
                //we already investigated this node
                //so we didnt put in the next iteration
                //and we need put it once (can be multipy neighbort)
                //
                isVisited = true;
              }
            }
            if (!isVisited) {
              //
              //it was Not investigated yet so we push in the next iteration
              //
              nextIteration.push(next[bubbleIndex].neighbor[nextBubbleIndex]);
            }
          }
          //
          //and becouse it was the same color i need to and this to the needToDestroy tabel
          //
          needToDestroy.push(next[bubbleIndex]);
        }
      }
      next = nextIteration; // change the tabels
    }
    if (needToDestroy.length + 1 /*this*/ >= 3) {
      needToDestroy.forEach((item) => item.destroy());
      this.destroy();
      //
      //falling the left parts
      //
      this.falling();
    }
  }
  destroy() {
    //
    //before clearing the globel tabel we need to clear the neighbor's
    //neighbor tabel the destroierable referenc
    //
    for (
      let bubbleIndex = 0;
      bubbleIndex < this.neighbor.length;
      bubbleIndex++
    ) {
      let newNeighbor = [];
      for (
        let neighborBubbleIndex = 0;
        neighborBubbleIndex < this.neighbor[bubbleIndex].neighbor.length;
        neighborBubbleIndex++
      ) {
        if (this.neighbor[bubbleIndex].neighbor[neighborBubbleIndex] != this) {
          newNeighbor.push(
            this.neighbor[bubbleIndex].neighbor[neighborBubbleIndex]
          );
        }
      }
      this.neighbor[bubbleIndex].neighbor = newNeighbor;
    }
    this.neighbor.length = 0;
    //
    //we done with the neighbor so we can clear the object from the
    //globel tabel and than tha g_collectro gonna destroct this
    //
    let temporary = [];
    for (let i = 0; i < allBubbles.length; i++) {
      if (allBubbles[i] !== this) {
        temporary.push(allBubbles[i]);
      }
    }
    allBubbles = temporary;
  }
  countNeighbor() {
    for (let i = 0; i < allBubbles.length; i++) {
      if (allBubbles[i] === this) continue;
      if (
        sqrt(
          (allBubbles[i].position.y - this.position.y) ** 2 +
            (allBubbles[i].position.x - this.position.x) ** 2
        ) <=
        allBubbles[i].r + this.r + e /*+nearBoubelRange*/
      )
        this.neighbor.push(allBubbles[i]);
    }
  }

  falling() {
    //not optimal bet less referenc copying
    let counter = 0;
    let whileChange = true;
    while (whileChange && counter < 20) {
      counter++;
      whileChange = false;
      for (let i = 0; i < allBubbles.length; i++) {
        if (allBubbles[i].stable) {
          allBubbles[i].visited = true;
          if (allBubbles[i].neighbor.some((bubble) => bubble.visited)) {
            allBubbles[i].neighbor.forEach((bubble) => (bubble.visited = true));
            whileChange = true;
          }
        }
        if (allBubbles[i].visited) {
          if (allBubbles[i].neighbor.some((bubble) => bubble.visited)) {
            allBubbles[i].neighbor.forEach((bubble) => (bubble.visited = true));
            whileChange = true;
          }
        }
      }
    }
    let nextAll = [];
    for (let i = 0; i < allBubbles.length; i++) {
      if (allBubbles[i].visited) {
        allBubbles[i].visited = false;
        nextAll.push(allBubbles[i]);
      } else {
        fallingBubbles.push(allBubbles[i]);
      }
    }
    allBubbles = nextAll;
  }

  draw() {
    strokeWeight(1);
    stroke(51);
    fill(
      collors[this.color][0],
      collors[this.color][1],
      collors[this.color][2]
    );
    circle(this.position.x, this.position.y, this.r * 2);

    fill(0);
    noStroke();
    textSize(this.r);
    text(str(this.color), this.position.x - 5, this.position.y + 5);
  }
}
