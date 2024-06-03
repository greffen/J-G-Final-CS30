// Intense Walrus Mission (placeholder name)
// Griffin Bartsch && Jackson Peddle
// 06/15/2024
//
// Rhythm based game with piano keys
//
// Extras for Experts: swtich, regex - replaceAll, 

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
  let settingsSelectButton = new Button(width-200, height/2, width/5, height/5, "settings", settingsButton);
  buttons.push(settingsSelectButton);
  let infoCreditsButton = new Button(width-200, height/2 + 200, width/5, height/5, "credits", creditsButton);
  buttons.push(infoCreditsButton);
  let startLevel1 = new Button(width/2, height/2, width/5, height/5, "level1", settingsButton);
  buttons.push(startLevel1);
  let goBackButton = new Button(0 + width/12, 0 + height/12, width/8, height/10, state, settingsButton);
  backButton.push(goBackButton);
  
  //stupid scroll squares
  for (let i = 0; i < 100; i++) {
    squares.push(new Square(width/2, i*100));
  }

  //setup for the actual gameplay
  noteTravelTime = (height - 100) / 5; // 5 is the speed of the notes
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

//squares in the temp scroll thing
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

//BARS THAT DROP DOWN CODE

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

  //sets the notes speed based on the song BPM
  update() {
    this.y += this.speed;
  }

  display() {
    let noteId;
    let colorVal = color(0);


    //holds the colours as well as the identifier of the notes to be handed out on creation
    switch (this.direction) {
    case "LEFT":
      noteId = 0;
      colorVal = color(255, 0, 0);
      break;
    case "UP":
      noteId = 1;
      colorVal = color(0, 255, 0);
      break;
    case "DOWN":
      noteId = 2;
      colorVal = color(0, 0, 255);
      break;
    case "RIGHT":
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

  if (keyCode === 13) { //enter key
    if (state === "level select screen") {
      //if enter is pressed on the level selector, it'll go to the gameplay
      state = "level1";
      // song.play();
      gameStartTime = millis();
    } 
    else if (state === "level1") {
      //if enter is pressed again on the gameplay screen, it'll go back to the level select screen
      // song.stop();
      state = "level select screen";
    } 
    else if (state === "end") {
      //end the game here
    }
  } 

  else if (state === "level1") {
    let score = 0;
    //checking for the notes distance from perfection
    const hitNoteIndex = notes.findIndex(note => {
      return note.keyIndex === keyIndex && note.y >= height - 150 && note.y <= height - 50;
    });

    //if its a good hit, add points
    if (hitNoteIndex !== -1 && !notes[hitNoteIndex].pressed) {
      score += 100;
      notes[hitNoteIndex].pressed = true;
      notes.splice(hitNoteIndex, 1);
    } 
    //else if it isnt a good hit, deduct points 
    else if (keyIndex !== undefined && (hitNoteIndex === -1 || hitNoteIndex !== -1 && notes[hitNoteIndex].pressed)) {
      score -= 50;
    }
  }
}

function songEnded() {
  state = "start screeen";
}

function drawGame() {
  background(0);
  drawKeys();
  // drawScore();
  // drawPercentage();
  generateNotes();

}

function generateNotes() {
  //read the .SM file data
  loadStrings("Assets/Tracks/Syrup.sm", function(smData) {
    //callback function executed when data is loaded
    let notesData = parseSMFile(smData);
    let bpmChanges = extractBPMChanges(notesData);
    let bpmToTime = calculateBPMToTime(bpmChanges);
    let notes = extractNotesData(notesData);
    let gameNotes = convertNotesToGameNotes(notes, bpmToTime);

    //now process the gameNotes array or do any other necessary operations
    for (let i = 0; i < gameNotes.length; i++) {
      let note = gameNotes[i];
      let bar = new Bars(note.direction);
      bar.y = note.time * noteTravelTime;
      notes.push(bar);
    }
  });

  //function to actually parse the info contained in the .SM file
  function parseSMFile(smData) {  
    let notesData = {}; //the object to store parsed data
    let currentSection = ""; //the variable to keep track of only the current section being parsed

    //iterate through each line of the SM file
    for (let line of smData) {
      //check to see if the line starts with "#" (denoting sections of information)
      if (line.startsWith("#")) {
        //extract the section name minus the # and if it's the BPMS first case, add the text after the ":" to another line 
        currentSection = line.substring(1).trim().replaceAll(/:.*/g, "");
        notesData[currentSection] = []; //create an array to store data for the section

        //the adding of the line after the ":"
        let firstEntry = line.match(/:.*/g)[0].replaceAll(":","");
        if (currentSection === "BPMS") {
          notesData[currentSection].push(firstEntry);
        }

      }
      else {
        //if it's NOT a section header (meaning it is data), push the line to the corresponding section array
        notesData[currentSection].push(line.trim());
      }
    }

    return notesData;
  }

  function extractBPMChanges(notesData) {
    let bpmSection = notesData["BPMS"];
    let bpmChanges = {};
  
    //split the BPM section into individual BPM entries
    let bpmEntries = bpmSection.join(",").split(";").filter(entry => entry.trim() !== "");
    
    //iterate over each BPM entry
    for (let bpmEntry of bpmEntries) {
      //split the entry into beat and BPM pairs using '=' as delimiter
      let pairs = bpmEntry.split(",");
      
      pairs = dePair(pairs);

      //iterate over each pair to extract beat and BPM
      for (let pair of pairs) {
        let [beatValue, bpmValue] = pair.split("=");
        // beatValue.splice(); 
        let beat = parseFloat(beatValue);
        let bpm = parseFloat(bpmValue);

        // Check if beat and BPM are valid numbers (not NaN)
        if (!isNaN(beat) && !isNaN(bpm)) {
          //store the BPM change in the bpmChanges object
          bpmChanges[beat] = bpm;
        } 
        else {
          console.error("AHHHHH");
        }
      
      }
    }
  
    return bpmChanges;
  }

  function calculateBPMToTime(bpmChanges) {
    let bpmToTime = {};
    let currentTime = 0;


    //iterate over each BPM change using Object.entries()
    for (let [beat, bpm] of Object.entries(bpmChanges)) {
      let time = currentTime + (beat - currentTime) * 60 / bpm; //time in seconds
      bpmToTime[beat] = time;
      currentTime = time;
    }
    return bpmToTime;
    
  }

  function extractNotesData(notesData) {
    //extract the NOTES section from parsed data
    notesData["NOTES"].splice(0, 5);
    console.log(notesData["NOTES"]);
    return notesData["NOTES"];

  }

  function convertNotesToGameNotes(notes, bpmToTime) {
    let gameNotes = [];

    //iterate through each note in the notes data
    for (let note = 0; note < notes.length; note++) {
      if (notes[note].includes("//") || notes[note].includes(",")) { 
        notes.splice(note, 1);
      }
      else {
        console.log(notes);
        //parse the note data to extract direction and timing
        let [direction, timing] = note.split(":");
        //convert timing to game time based on BPM changes
        let time = bpmToTime[parseFloat(timing)];
        //create a game note object with direction and timing information
        let gameNote = {
          direction: direction.trim(),
          timing: time
        };
        gameNotes.push(gameNote);
      }
      // console.log(gameNotes);
      return gameNotes;
    }
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


function drawKey(x, y, rotation, colorVal) {
  // a
  if (rotation === 0) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(x, y, 50, 20);
    // creates inner black bar that is consistent between bars
    fill(colorVal);
    rect(x, y, 35, 8);
  }
  // s
  else if (rotation === 1) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke(); 
    fill(255);
    rect(x, y, 50, 20);
    // creates inner black bar that is consistent between bars
    fill(colorVal);
    rect(x, y, 35, 8);
  }
  // k
  else if (rotation === 2) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke(); 
    fill(255);
    rect(x, y, 50, 20);
    // creates inner black bar that is consistent between bars
    fill(colorVal);
    rect(x, y, 35, 8);
  }
  // l
  else if (rotation === 3) {
    fill(colorVal);
    rect(x, y, 55, 25);
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(x, y, 50, 20);
    // creates inner black bar that is consistent between bars
    fill(colorVal);
    rect(x, y, 35, 8);
  }
}

function dePair(thePair) {
  let newPair = [];
   
  for (let i = 0; i < thePair.length; i++) {
    if (i % 2 === 0) {
      newPair.push(thePair[i]);
    }    
  }
  return newPair;
}