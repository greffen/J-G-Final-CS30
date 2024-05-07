// Placeholder Name
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts:

let state = "start screen";
let buttons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  let newButton = new Button(width/2, height/2, width/8, height/20);//, 200, 100);
  buttons.push(newButton);
}

function draw() {
  background("white");
  if (state === "start screen") {
    for (let button of buttons) {
      button.display();
      button.update();
    }
    fill("red");
    rectMode(CENTER);
    circle(mouseX, mouseY, 25);
  }
  else if (state === "game") {
    //the game things
  }
  else if (state === "level select screen") {
    //place to pick the song 
  }
  else if (state === "win") {
    background(255, 253, 201);
    textSize(50);
    textAlign(CENTER, CENTER);
    textFont("Crackman");
    text("WE'VE GOT A WINNER!", width/2, height/2);
  }
  else if (state === "death screen") {
    //the "retry or exit" screen
  }
}

class Button {
  constructor(x, y, w, l) {
    this.x = x;
    this.y = y;
    this.length = l;
    this.width = w;
    this.minLength = l;
    this.minWidth = w;
    this.maxLength = l * 1.5;
    this.maxWidth = w * 1.5;
  } 
  
  display(){
    fill("255");
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.length);//);, this.width, this.length);
  }

  changeTheSizeOfTheCircleBasedOnTheMouseProximity() {
    let mouseDistance = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDistance < width/8) {
      let theWidth = map(mouseDistance, 0, width/8, this.minWidth, this.maxWidth);
      this.width = theWidth;
      let theLength = map(mouseDistance, 0, length/20, this.minLength, this.maxLength);
      this.length = theLength;
    }
    else {
      this.width = this.minWidth;
      this.length = this.minLength;
    } 
  }
    
  update(){
    this.changeTheSizeOfTheCircleBasedOnTheMouseProximity();
  }
}