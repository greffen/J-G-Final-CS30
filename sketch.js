// Intense Walrus Mission (placeholder name)
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts:

let state = "start screen";
let buttons = [];
let levelSelectBackground, startScreenBackground;
let startButton, settingsButton, creditsButton, tempDeathButton;

function preload() {
  startButton = loadImage("Assets/Images/unnamed.png");
  settingsButton = loadImage("Assets/Images/settings button.png");
  startScreenBackground = loadImage("Assets/Images/intensewalrusmissionfr.png");
  levelSelectBackground = loadImage("Assets/Images/flower_background.jpg");
  creditsButton = loadImage("Assets/Images/credits.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //adds all buttons to the "buttons" array
  let startGameButton = new Button(width-200, height/2 - 200, width/5, height/5, "level select screen", startButton);//(location:)x, y, (size:)width, height, (where it takes you:)string, name
  buttons.push(startGameButton);
  let settingsSelectButton = new Button(width-200, height/2, width/5, height/5, "settings", settingsButton)
  buttons.push(settingsSelectButton);
  // let tempDeathButton = new Button(width/2, height/2, width/5, height/5, "death screen", settingsButton)
  // buttons.push(tempDeathButton);
  let infoCreditsButton = new Button(width-200, height/2 + 200, width/5, height/5, "credits", creditsButton)
  buttons.push(infoCreditsButton);
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
    //place to pick the song
    imageMode(CORNER);
    background(levelSelectBackground);
    redMouseCircle();
    let backButton = new Button(width/5, height/5, width/10, height/10, "back", settingsButton)//goBackButton)
    buttons.push(backButton);
  }
  else if (state === "settings") {
    background(0);
    redMouseCircle();
  }
  else if (state === "credits") {
    background("red");
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
    //in the future make this fade to red and then have the buttons appear
    background(255, 0, 0, 100);
    redMouseCircle();
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

function redMouseCircle() {
  noStroke();
    fill(255, 0, 0, 150);
    rectMode(CENTER);
    circle(mouseX, mouseY, 25);
}

// const scrollProperties = {
//   y: 0,
//   spd: 0
// };

// let squares = [];

// function setup() {
//   createCanvas(windowWidth - 4, windowHeight - 4);
//   // Initialize squares
//   for (let i = 0; i < 20; i++) {
//     squares.push(new Square(width/2, i*100));
//   }
// }

// function draw() {
//   background(13, 17, 21);
//   scrollProperties.y -= scrollProperties.spd;
//   scrollProperties.spd /= 1.9;

//   // Draw squares
//   for (let square of squares) {
//     square.display();
//   }
// }

// function mouseWheel(event) {
//   scrollProperties.spd = event.delta;
// }

// class Square {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//     this.size = 50;
//     this.color = color(random(255), random(255), random(255));
//   }

//   display() {
//     fill(this.color);
//     rectMode(CENTER);
//     let scrolledY = this.y + scrollProperties.y;
//     rect(this.x, scrolledY, this.size, this.size);
//   }
// }

//^ is scroll to be worked on