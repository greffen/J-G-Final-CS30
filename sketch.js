// Intense Walrus Mission (final name)
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts: swtich, regex - replaceAll, added p5 to eslint, fft, 

//the menu "things"
let state = "start screen";
let lastState = "start screen";
let buttons = [];
let backButton = [];
let levelSelectBackground, startScreenBackground;
let startButton, settingsButton, creditsButton, tempDeathButton, goBackButton;

//the level select "things"
let squares = [];
const scrollProperties = {
  y: 0,
  spd: 0
};

//the gameplay "things"
let notes = [];
let lastNoteTime = 0;
let gameStartTime;
let activeKeys = [false, false, false, false]; 
let noteTravelTime;
let fft;
let song;
let songDuration;
let score = 0;
let songStarted = false;

function preload() {
  startButton = loadImage("Assets/Images/unnamed.png");
  // goBackButton = loadImages("Assets/Images/XXX.png");
  settingsButton = loadImage("Assets/Images/settings button.png");
  startScreenBackground = loadImage("Assets/Images/intensewalrusmissionfr.png");
  levelSelectBackground = loadImage("Assets/Images/flower_background.jpg");
  creditsButton = loadImage("Assets/Images/credits.png");

  song = loadSound("Assets/Tracks/riot.mp3", () => {
    songDuration = song.duration(); // get the duration of the song after it has been loaded
    song.onended(songEnded);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //adds all buttons to the "buttons" array(except the back button which is in its own array that is displayed off the start screen as well)
  let startGameButton = new Button(width-200, height/2 - 200, width/5, height/5, "level select screen", startButton);//(location:)x, y, (size:)width, height, (where it takes you:)string, name
  buttons.push(startGameButton);
  let settingsSelectButton = new Button(width-200, height/2, width/5, height/5, "settings", settingsButton);
  buttons.push(settingsSelectButton);
  let infoCreditsButton = new Button(width-200, height/2 + 200, width/5, height/5, "credits", creditsButton);
  buttons.push(infoCreditsButton);
  let startLevel1 = new Button(width/2, height/2, width/5, height/5, "level1", settingsButton);
  buttons.push(startLevel1);
  let goBackButton = new Button(0 + width/12, 0 + height/12, width/8, height/10, state, settingsButton);
  backButton.push(goBackButton);
  
  //setup for the actual gameplay
  noteTravelTime = (height - 100) / 5; // 5 is the speed of the notes

  fft = new p5.FFT(0.8, 32);

}


function draw() {
  background("white");
  //setting the background and buttons if the scene is start screen
  if (state === "start screen") {
    imageMode(CORNER);
    background(startScreenBackground);
    regularButtons();
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
      square.display();
    }
    redMouseCircle();
    backButtonNoS();
  }
  else if (state === "settings") {
    background(0);
    redMouseCircle();
    backButtonNoS();
  }
  else if (state === "credits") {
    background("red");
    backButtonNoS();
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
    
    if (songStarted === false) {
      song.play();
      songStarted = true;
    }
    gameStartTime = millis();
    const hitNoteIndex = notes.findIndex(note => {
      return note.keyIndex === this.keyIndex && note.y >= height - 150 && note.y <= height - 50;
    });

    if (hitNoteIndex !== -1 && !notes[hitNoteIndex].pressed) {
      score += 100;
      notes[hitNoteIndex].pressed = true;
      notes.splice(hitNoteIndex, 1);
    } 
    else if (this.keyIndex !== undefined && (hitNoteIndex === -1 || hitNoteIndex !== -1 && notes[hitNoteIndex].pressed)) {
      //remove points/handle misses as needed
      score -= 50;
    }
    drawGame();
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

function regularButtons() {
  for (let button of buttons) {
    button.update();
  }
}

function backButtonNoS() {
  for (let button of backButton) {
    button.update();
  }
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
        mouseY > this.y - this.length / 2 && mouseY < this.y + this.length / 2 && state === "start screen") {
      //change state to the state the button changes you to
      if (backButton.includes(this)) {
        state = lastState;
      }
      else {
        state = this.state;
      }
    }
    else if (mouseX > this.x - this.width / 2 && mouseX < this.x + this.width / 2 &&
        mouseY > this.y - this.length / 2 && mouseY < this.y + this.length / 2 && state !== "start screen") {
      if (backButton.includes(this)) {
        state = lastState;
      }
    }
  }
}

//the class for the notes
class Bars {
  constructor(direction) {
    this.direction = direction;
    this.y = 0;
    this.speed = 5;
    this.pressed = false;

    const keySize = 60;
    const xOffset = width / 2 - 1.5 * keySize;

    switch (this.direction) {
    case "A":
      this.x = xOffset;
      this.keyIndex = 0;
      break;
    case "S":
      this.x = xOffset + keySize;
      this.keyIndex = 1;
      break;
    case "K":
      this.x = xOffset + 2 * keySize;
      this.keyIndex = 2;
      break;
    case "L":
      this.x = xOffset + 3 * keySize;
      this.keyIndex = 3;
      break;
    }
  }

  //sets the notes speed based on the song BPM
  update() {
    this.y += this.speed;
  }

  display() {
    let noteId;
    let colorVal = color(0);


    //holds the colours as well as the identifier of the notes to be handed out on creation
    switch (this.direction) {
    case "A":
      noteId = 0;
      colorVal = color(255, 0, 0);
      break;
    case "S":
      noteId = 1;
      colorVal = color(0, 255, 0);
      break;
    case "K":
      noteId = 2;
      colorVal = color(0, 0, 255);
      break;
    case "L":
      noteId = 3;
      colorVal = color(255, 255, 0);
      break;
    }

    //calls the function that draws the notes as well as translates the notes to the correct place on the screen
    push();
    translate(this.x, this.y);
    drawKey(0, 0, noteId, colorVal);
    pop();
  }
  
  offScreen() {
    //tell if the bar has gone offscreen or not
    return this.y > height;
  }
  
  removeIfHit() {
    //removes the bar if it's hit by the key
    if (this.y >= height - 150 && this.y <= height - 50 && activeKeys[this.keyIndex] && !this.pressed) {
      this.pressed = true;
      return true;
    }
    return false;
  }

  missed() {
    //tells if you missed hittin ghte bar, so it'll keep going
    return this.y > height - 50 && !this.pressed;
  }
}

function keyPressed() { //askl
  let keyIndex;

  if (keyCode === 65) {//a
    keyIndex = 0;
  } 
  else if (keyCode === 83) {//s
    keyIndex = 1;
  } 
  else if (keyCode === 75) {//k
    keyIndex = 2;
  } 
  else if (keyCode === 76) {//l
    keyIndex = 3;
  }
  
  if (keyIndex !== undefined) {
    //so long as any of the askl keys are pressed, the active keys will always be true
    activeKeys[keyIndex] = true;
  }
}

function songEnded() {
  state = "start screeen";
}

function drawGame() {
  background(0);
  drawKeys();
  drawScore();
  drawPercentage();
  fft.analyze();
  
  generateNotes();

  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    note.update();
    note.display();

    // Deduct points or handle misses as needed
    if (note.missed()) {
      score -= 50;
      note.pressed = true;
    }

    if (note.offScreen() || note.pressed) {
      notes.splice(i, 1);
    }
  }
}

function generateNotes() {
  let currentTime = millis() - gameStartTime - noteTravelTime;

  if (currentTime - lastNoteTime >= 200) {
    let bass = fft.getEnergy("bass");
    let mid = fft.getEnergy("mid");
    let treble = fft.getEnergy("treble");
    let lowMid = fft.getEnergy("lowMid");
    let highMid = fft.getEnergy("highMid");

    let direction = round(random(0, 3)); //randomly chooses a direction

    switch (direction) { //creates a new note in ced chosen direction
    case 0: //a
      if (bass > 230) { //the threshold for the a key's row
        notes.push(new Bars("A"));
      }
      break;
    case 1: //s
      if (mid > 225) { //the threshold for the s key's row
        notes.push(new Bars("S"));
      }
      break;
    case 2: //k
      if (lowMid > 100 && treble > 110) { //you get the deal
        notes.push(new Bars("K"));
      }
      break;
    case 3: //l
      if (highMid > 120 && bass > 100) { //again
        notes.push(new Bars("K"));
      }
      break;
    }

    lastNoteTime = currentTime;
  }
}

function drawPercentage() { // function to draw the percentage text
  fill(255);
  textSize(24);
  let percentage = map(song.currentTime(), 0, songDuration, 0, 100); // map the current time to a percentage
  percentage = percentage.toFixed(0); // round the percentage to the nearest integer
  text(`${percentage}%`, width / 2, height - 25); // display the percentage text centered at the bottom of the canvas
}

function drawScore() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Score: ${score}`, width / 2, 40);
}

function keyReleased() {
  let keyIndex;

  if (keyCode === 65) {
    keyIndex = 0;
  } 
  else if (keyCode === 83) {
    keyIndex = 1;
  } 
  else if (keyCode === 75) {
    keyIndex = 2;
  } 
  else if (keyCode === 76) {
    keyIndex = 3;
  }

  if (keyIndex !== undefined) {
    activeKeys[keyIndex] = false;
  }
}

function drawKeys() {
  const keySize = 60;
  const yPos = height - 100;
  const xOffset = width / 2 - 1.5 * keySize;

  for (let i = 0; i < 4; i++) {
    let x = xOffset + i * keySize;
    let colorVal = activeKeys[i] ? color(255, 255, 255) : color(0, 0, 0);
    drawKey(x, yPos, i, colorVal);
  }
}


function drawKey(x, y, noteId, colorVal) {
  // a
  if (noteId === 0) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(x, y, 50, 20);
    // creates inner black bar that is consistent between bars (does this for every lane)
    fill(colorVal);
    rect(x, y, 35, 8);
  }
  // s
  else if (noteId === 1) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke(); 
    fill(255);
    rect(x, y, 50, 20);
    fill(colorVal);
    rect(x, y, 35, 8);
  }
  // k
  else if (noteId === 2) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke(); 
    fill(255);
    rect(x, y, 50, 20);
    fill(colorVal);
    rect(x, y, 35, 8);
  }
  // l
  else if (noteId === 3) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(x, y, 50, 20);
    fill(colorVal);
    rect(x, y, 35, 8);
  }
}


//go to line 129 137