// Intense Walrus Mission (final name)
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts: swtich, regex - replaceAll, added p5 to eslint, fft, toFixed

const gameState = {
  MENU: 0,
  GAME: 1,
  LEVELS: 2,
  SETTINGS: 3,
  CREDITS: 4,
  SONGS1: 5,
  SONGS2: 6,
  SONGS3: 7,

};
const songState = { //all of the states selectable
  SONG1: 1,
  SONG2: 2,
  SONG3: 3,
  SONG4: 4,
  SONG5: 5,
};
let buttons = []; //start screen button array
let backButton = []; //back buttons array
let songButton = []; //level select buttons array
let levelSelectBackground, startScreenBackground, gameBackground; //background images
let startButton, settingsButton, creditsButton, tempDeathButton, goBackButton, theBackButton, songSelectButton; //images for buttons
let state = gameState.MENU; //starting state
let notes = [];
let fft;
let lastNoteTime = 0;
let gameStartTime;
let score = 0;
let activeKeys = [false, false, false, false]; //the 4 keys used
let song1Duration, song2Duration;
let selectedSong;


function preload() {
  startButton = loadImage("Assets/Images/startgamebutton.png");
  theBackButton = loadImage("Assets/Images/backbutton.png");
  settingsButton = loadImage("Assets/Images/settingsbutton.png");
  startScreenBackground = loadImage("Assets/Images/intensewalrusmissionfr.png");
  levelSelectBackground = loadImage("Assets/Images/flower_background.jpg");
  gameBackground = loadImage("Assets/Images/gamebackground.png");
  creditsButton = loadImage("Assets/Images/creditsbutton.png");
  songSelectButton = loadImage("Assets/Images/songbuttontemplate.png");
  songState.SONG1 = loadSound("Assets/Tracks/riot.mp3", () => {
    song1Duration = songState.SONG1.duration(); // get the duration of the song after it has been loaded
  });
  songState.SONG2 = loadSound("Assets/Tracks/eineKleineNachtmusik.mp3", () => {
    song2Duration = songState.SONG2.duration();
  });
} 

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //adds all buttons to the "buttons" array(except the back button which is in its own array that is displayed off the start screen as well)
  let startGameButton = new Button(width-200, height/2 - 200, width/5, height/5, gameState.LEVELS, startButton);//(location:)x, y, (size:)width, height, (where it takes you:)string, name
  buttons.push(startGameButton);
  let settingsSelectButton = new Button(width-200, height/2, width/5, height/5, gameState.SETTINGS, settingsButton);
  buttons.push(settingsSelectButton);
  let infoCreditsButton = new Button(width-200, height/2 + 200, width/5, height/5, gameState.CREDITS, creditsButton);
  buttons.push(infoCreditsButton);
  let goBackButton = new Button(0 + width/12, 0 + height/12, width/8, height/10, gameState.MENU, theBackButton);
  backButton.push(goBackButton);
  let songTwoButton = new Button(0 + width/2, 0 + height/2, width/4, height/5, gameState.SONGS2, songSelectButton);
  songButton.push(songTwoButton);
  let songOneButton = new Button(0 + width/2, 0 + height/12, width/4, height/5, gameState.SONGS1, songSelectButton);
  songButton.push(songOneButton);

  fft = new p5.FFT(0.8, 32);
}

function draw() {
  switch (state) {
  case gameState.MENU:
    drawMenu();
    break;
  case gameState.GAME:
    drawGame();
    break;
  case gameState.LEVELS:
    drawLevels();
    break;
  case gameState.SETTINGS:
    drawSettings();
    break;
  case gameState.CREDITS:
    drawCredits();
    break;
  }
}

function drawMenu() {
  imageMode(CORNER);
  background(startScreenBackground);
  regularButtons();
  redMouseCircle();
}

function drawLevels() {
  //place to pick the song
  imageMode(CORNER);
  background(levelSelectBackground);
  redMouseCircle();
  backButtonFunction();
  selectSongButton();
}

function drawSettings() {
  background(0);
  redMouseCircle();
  backButtonFunction();
}

function drawCredits() {
  background("red");
  backButtonFunction();
}

function mousePressed() {
  //checks to see if you are clicking a button and performs the action indicated if you are
  for (let button of buttons) {
    button.mouseClicked();
  }
  for (let button of backButton) {
    button.mouseClicked();
  }
  for (let button of songButton) {
    button.mouseClicked();
  }
}

function redMouseCircle() {
  noStroke();
  fill(255, 0, 0, 150);
  rectMode(CENTER);
  circle(mouseX, mouseY, 25);
}

function regularButtons() {
  for (let button of buttons) {
    button.update();
  }
}

function backButtonFunction() {
  for (let button of backButton) {
    button.update();
  }
}

function selectSongButton() {
  for (let button of songButton) {
    button.update();
  }
}

class Button {
  constructor(x, y, w, l, theState, image) {
    this.x = x;
    this.y = y;
    this.length = l;
    this.width = w;
    this.minLength = l;
    this.minWidth = w;
    this.maxLength = l * 1.5;
    this.maxWidth = w * 1.5;
    this.reach = 60;
    this.state = theState;
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
    if (mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.length / 2 &&
      mouseY < this.y + this.length / 2 && state === gameState.LEVELS && state !== gameState.GAME) {
      state = gameState.GAME; // Set state to the button's state if not a back button
      startTheNotes();
    }
    else if (mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.length / 2 &&
      mouseY < this.y + this.length / 2 && state !== gameState.MENU && state !== gameState.GAME) {
      state = gameState.MENU; // Set state to the button's state if not a back button
    }
    else if (mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.length / 2 &&
      mouseY < this.y + this.length / 2 && state === gameState.MENU && state !== gameState.GAME) {
      state = this.state; // Set state to the button's state if not a back button
    }
    else if (this.state === gameState.SONGS1) {
      selectedSong = songState.SONG1;
    }
    else if (this.state === gameState.SONGS2) {
      selectedSong = songState.SONG2;
    }
  }
  
}

function startTheNotes() {
  state = gameState.GAME;
  selectedSong.play();
  gameStartTime = millis();
  
}

function keyPressed() {
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
    activeKeys[keyIndex] = true;
  }

  if (keyCode === 100) {
    if (state === gameState.MENU) {
      startTheNotes();
    } 
    else if (state === gameState.GAME) {
      selectedSong.stop();
      state = gameState.MENU;
    }
  }
  
  else if (state === gameState.GAME) {
    const hitNoteIndex = notes.findIndex(note => {
      return note.keyIndex === keyIndex && note.y >= height - 150 && note.y <= height - 50;
    });

    if (hitNoteIndex !== -1 && !notes[hitNoteIndex].pressed) {
      score += 100;
      notes[hitNoteIndex].pressed = true;
      notes.splice(hitNoteIndex, 1);
    } 
    else if (keyIndex !== undefined && (hitNoteIndex === -1 || hitNoteIndex !== -1 && notes[hitNoteIndex].pressed)) {
      // Deduct points or handle misses as needed
      score -= 50;
    }
  }
}

function drawScore() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Score: ${score}`, width / 2, 40);
}

function drawPercentage() { // function to draw the percentage text
  fill(255);
  textSize(24);
  if (selectedSong === songState.SONG1) {
    let percentage = map(selectedSong.currentTime(), 0, song1Duration, 0, 100); // map the current time to a percentage
    percentage = percentage.toFixed(0); // round the percentage to the nearest integer
    text(`${percentage}%`, width / 2, height - 25); // display the percentage text centered at the bottom of the canvas
  }
  else if (selectedSong === songState.SONG2) {
    let percentage = map(selectedSong.currentTime(), 0, song2Duration, 0, 100); // map the current time to a percentage
    percentage = percentage.toFixed(0); // round the percentage to the nearest integer
    text(`${percentage}%`, width / 2, height - 25); // display the percentage text centered at the bottom of the canvas
  }
}


function drawGame() {
  imageMode(CORNER);
  background(gameBackground);
  drawKeys();
  drawScore();
  drawPercentage();
  fft.analyze();

  generateNotes();

  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    note.update();
    note.display();

    if (note.missed()) {
      // Deduct points or handle misses as needed
      score -= 50;
      note.pressed = true;
    }

    if (note.offScreen() || note.pressed) {
      notes.splice(i, 1);
    }
  }
}

function generateNotes() {
  let currentTime = millis() - gameStartTime;

  if (currentTime - lastNoteTime >= 180) {
    let bass = fft.getEnergy("bass");
    let mid = fft.getEnergy("mid");
    let treble = fft.getEnergy("treble");
    let lowMid = fft.getEnergy("lowMid");
    let highMid = fft.getEnergy("highMid");

    let direction = round(random(0, 3)); // randomly choose a direction

    switch (direction) { // create a new note in the chosen direction
    case 0: // left
      if (bass > 200) { // adjust the threshold for the left arrow
        notes.push(new Bar("LEFT"));
      }
      break;
    case 1: // up
      if (mid > 225) { // adjust the threshold for the up arrow
        notes.push(new Bar("UP"));
      }
      break;
    case 2: // down
      if (lowMid > 150 && treble > 150) {
        notes.push(new Bar("DOWN"));
      }
      break;
    case 3: // right
      if (highMid > 150 && bass > 150) {
        notes.push(new Bar("RIGHT"));
      }
      break;
    }

    lastNoteTime = currentTime;
  }
}

function drawKey(x, y, noteID, colorVal) {
  // a
  if (noteID === 0) {
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
  else if (noteID === 1) {
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
  else if (noteID === 2) {
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
  else if (noteID === 3) {
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

class Bar { // class for the arrows that fall down the screen
  constructor(direction) {
    this.direction = direction;
    this.y = 0;
    this.speed = 5;
    this.pressed = false;
    const keySize = 60;
    const xOffset = width / 2 - 1.5 * keySize;

    switch (this.direction) {
    case "LEFT":
      this.x = xOffset;
      this.keyIndex = 0;
      break;
    case "UP":
      this.x = xOffset + keySize;
      this.keyIndex = 1;
      break;
    case "DOWN":
      this.x = xOffset + 2 * keySize;
      this.keyIndex = 2;
      break;
    case "RIGHT":
      this.x = xOffset + 3 * keySize;
      this.keyIndex = 3;
      break;
    }
  }

  update() {
    this.y += this.speed;
  }

  display() {
    let noteID;
    let colorVal = color(0);

    switch (this.direction) {
    case "LEFT":
      noteID = 0;
      colorVal = color(255, 0, 0);
      break;
    case "UP":
      noteID = 1;
      colorVal = color(0, 255, 0);
      break;
    case "DOWN":
      noteID = 2;
      colorVal = color(0, 0, 255);
      break;
    case "RIGHT":
      noteID = 3;
      colorVal = color(255, 255, 0);
      break;
    }

    push();
    translate(this.x, this.y);
    drawKey(0, 0, noteID, colorVal);
    pop();
  }
  
  offScreen() {
    return this.y > height;
  }
  
  removeIfHit() {
    if (this.y >= height - 150 && this.y <= height - 50 && activeKeys[this.keyIndex] && !this.pressed) {
      this.pressed = true;
      return true;
    }
    return false;
  }

  missed() {
    return this.y > height - 50 && !this.pressed;
  }
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