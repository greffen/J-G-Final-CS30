// Intense Walrus Mission (placeholder name)
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts:

let state = "start screen";
let lastState = "start screen";
let buttons = [];
let backButton = [];
let levelSelectBackground, startScreenBackground;
let startButton, settingsButton, creditsButton, tempDeathButton, goBackButton;
const scrollProperties = {
  y: 0,
  spd: 0
};

let squares = [];

let notes = [];
let lastNoteTime = 0;
let gameStartTime;
let activeKeys = [false, false, false, false]; 


function preload() {
  startButton = loadImage("Assets/Images/unnamed.png");
 // goBackButton = loadImages("Assets/Images/XXX.png");
  settingsButton = loadImage("Assets/Images/settings button.png");
  startScreenBackground = loadImage("Assets/Images/intensewalrusmissionfr.png");
  levelSelectBackground = loadImage("Assets/Images/flower_background.jpg");
  creditsButton = loadImage("Assets/Images/credits.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //adds all buttons to the "buttons" array(except the back button which is in its own array that is displayed off the start screen as well)
  let startGameButton = new Button(width-200, height/2 - 200, width/5, height/5, "level select screen", startButton);//(location:)x, y, (size:)width, height, (where it takes you:)string, name
  buttons.push(startGameButton);
  let settingsSelectButton = new Button(width-200, height/2, width/5, height/5, "settings", settingsButton)
  buttons.push(settingsSelectButton);
  let infoCreditsButton = new Button(width-200, height/2 + 200, width/5, height/5, "credits", creditsButton)
  buttons.push(infoCreditsButton);
  let startLevel1 = new Button(width/2, height/2, width/5, height/5, "level1", settingsButton);
  buttons.push(startLevel1);
  let goBackButton = new Button(0 + width/12, 0 + height/12, width/8, height/10, state, settingsButton);
  backButton.push(goBackButton);
  
  //Initialize squares
  for (let i = 0; i < 100; i++) {
    squares.push(new Square(width/2, i*100));
  }
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
    redMouseCircle();
  }
  //Switching to the level select screen if you click the start button
  else if (state === "level select screen") {
    //the below is for the scroll speed
    scrollProperties.y -= scrollProperties.spd;
    scrollProperties.spd /= 1.9;
    //place to pick the song
    imageMode(CORNER);
    background(levelSelectBackground);
    for (let square of squares) {
      square.display()
    }
    redMouseCircle();
    for (let button of backButton) {
      button.update();
    }
  }
  else if (state === "settings") {
    background(0);
    redMouseCircle();
    for (let button of backButton) {
      button.update();
    }
  }
  else if (state === "credits") {
    background("red");
    for (let button of backButton) {
      button.update();
    }
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
    //in the future make this fade to red and then have the buttons appear
    background(255, 0, 0, 100);
    redMouseCircle();
  }
  //Scene shown while the actual gameplay is going
  else if(state === "level1") {
    background(0);
  }
}

function mousePressed() {
  //checks to see if you are clicking a button and performs the action indicated if you are
  for (let button of buttons) {
    button.mouseClicked();
  }
  for (let button of backButton) {
    button.mouseClicked();
  }
}

function redMouseCircle() {
  noStroke();
  fill(255, 0, 0, 150);
  rectMode(CENTER);
  circle(mouseX, mouseY, 25);
}

function mouseWheel(event) {
  scrollProperties.spd = event.delta;
}

class Button {
  constructor(x, y, w, l, state, image) {
    this.x = x;
    this.y = y;
    this.length = l;
    this.width = w;
    this.minLength = l;
    this.minWidth = w;
    this.maxLength = l * 1.5;
    this.maxWidth = w * 1.5;
    this.reach = 60;
    this.state = state;
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
      if (backButton.includes(this)) {
        state = lastState;
      }
      else {
        state = this.state;
      }
    }
  }
}

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.color = color(random(255), random(255), random(255));
  }

  display() {
    fill(this.color);
    rectMode(CENTER);
    let scrolledY = this.y + scrollProperties.y;
    rect(this.x, scrolledY, this.size, this.size);
  }
}

//scroll list (for later): 
//make the list loop on the screen
//a selected item
//make that selected item grow
//moved by mouse drag
//figure out levels





//BARS THAT DROP DOWN CODE

class Bars {
  constructor(key) {
    this.key = key;
    this.y = 0;
    this.speed = 5;
    this.pressed = false;

    const keySize = 60;
    const xOffset = width / 2 - 1.5 * keySize;

  }

  display() {

  }

  
}

function keyPressed() { //askl
  let keyIndex;

  if (keyCode === 65) {
    keyIndex = 0;
  } 
  else if (keyCode === 83) {
    keyIndex = 1;
  } 
  else if (keyCode === 75) {
    keyowIndex = 2;
  } 
  else if (keyCode === 76) {
    keyIndex = 3;
  }

  if (keyIndex !== undefined) {
    activeKeys[keyIndex] = true;
  }
}