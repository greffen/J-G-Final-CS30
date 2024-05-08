// Intense Walrus Mission (placeholder name)
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts:

let state = "start screen";
let buttons = [];
let startButton, levelSelectBackground, startScreenBackground;

function preload() {
  startButton = loadImage("Assets/Images/unnamed.png");
  startScreenBackground = loadImage("Assets/Images/intensewalrusmissionfr.png");
  levelSelectBackground = loadImage("Assets/Images/flower_backgroung.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //adds all buttons to the "buttons" array
  let newButton = new Button(width-200, height/2, width/5, height/5, "level select screen", startButton);
  buttons.push(newButton);
}

function draw() {
  background("white");
  //setting the background and buttons if the scene is start screen
  if (state === "start screen") {
    imageMode(CORNER);
    background(startScreenBackground);
    for (let button of buttons) {
      button.update();
    }
    fill("red");
    rectMode(CENTER);
    circle(mouseX, mouseY, 25);
  }
  //Switching to the level select screen if you click the start button
  else if (state === "level select screen") {
    //place to pick the song
    imageMode(CORNER);
    background(levelSelectBackground);
  }
  //Scene shown while the actual gameplay is going
  else if (state === "game") {
    //the game things
    background("black");
  }
  //Screen shown when you win a level
  else if (state === "win") {
    //the score and retry or exit upon winning
    background(255, 253, 201);
    textSize(50);
    textAlign(CENTER, CENTER);
    textFont("Crackman");
    text("WE'VE GOT A WINNER!", width/2, height/2);
  }
  //Screen shown if you dont do well enough on a level
  else if (state === "death screen") {
    //the "retry or exit" upon failure
  }
}

class Button {
  constructor(x, y, w, l, s, image) {
    this.x = x;
    this.y = y;
    this.length = l;
    this.width = w;
    this.minLength = l;
    this.minWidth = w;
    this.maxLength = l * 1.5;
    this.maxWidth = w * 1.5;
    this.reach = 60;
    this.state = s;
    this.image = image;
  } 
  display(){
    fill("255");
    imageMode(CENTER);

    //showing the image as a button with whatever image you input
    image(this.image, this.x, this.y, this.width, this.length);
  }
  changeTheSizeOfTheButtonBasedOnTheMouseProximity() {
    //the very descriptive function name here does the explanatory lifting
    let mouseDistance = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDistance < this.reach) {
      let scaleFactor = map(mouseDistance, this.reach, 0, 1, 1.5);
      this.width = this.minWidth * scaleFactor;
      this.length = this.minLength * scaleFactor; 
    }
    else {
      this.width = this.minWidth;
      this.length = this.minLength;
    } 
  }
  
  update(){
    this.changeTheSizeOfTheButtonBasedOnTheMouseProximity();
    this.display();
  }
  
  mouseClicked() {
    //look if you are within the button
    if (mouseX > this.x - this.width / 2 && mouseX < this.x + this.width / 2 &&
        mouseY > this.y - this.length / 2 && mouseY < this.y + this.length / 2) {
      //change state to the state the button changes you to
      state = this.state;
      console.log(this.state);
    }
  }
}

function mousePressed() {
  //checks to see if you are clicking a button and performs the action indicated if you are
  for (let button of buttons) {
    button.mouseClicked();
  }
}