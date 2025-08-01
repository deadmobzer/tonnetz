//Global Variables
let centerX;
let centerY;
const radius = 120;
const size = radius/2;

let handPose;
let video;
let hands = [];
let points = [];
let notes = [];
let osc;
let fingerOscs = [];
let aHex = makeHex(220);
let bHex = makeHex(aHex.r);
let cHex = makeHex(aHex.l);
let hexes = [];

/*
To start with I am testing the A scale (because its easy)
*/

function preload(){
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let x = makeHex(440);
  for(const key in x){
    console.log("{Key: " + key.toString() + ", Value: " + x[key].toString() + "}")
  }

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  handPose.detectStart(video, gotHands);
  console.log(x.note)
  centerX = width/2;
  centerY = height/2;

  for (let i = 0; i < 5; i++){
  let osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
  fingerOscs.push(osc);
  }

  createHexes(440, centerX, centerY, radius, 2, hexes);
  for(hex of hexes){
    for(const key in hex){
      let note = hex[key];
      notes.push(new Note(note.note, note.x, note.y));
    }
  }

  console.log("Hey were done adding notes");
  console.log(notes);
  let coords = [];
  for(let note of notes){
    console.log("Note: " + note.note + ", X: " + note.x + ", Y: " + note.y);
    if(coords.some(coord => coord.x === note.x && coord.y === note.y)){
      note.isDrawn = false; 
      console.log("Note already drawn at: " + note.x + ", " + note.y);
    }
    else{
      coords.push({x: note.x, y: note.y});
      note.isDrawn = true; 
    }

  }
  
}

function gotHands(returns){
  hands = returns;
}
function draw() {
  push();
  translate(width,0);
  scale(-1,1);
  image(video, 0, 0, width, height);
  pop();
  background(10,10,10, 200);
  drawHands();
  //drawHex(aHex, centerX, centerY);
  //drawHex(bHex, centerX + radius, centerY);
  //drawHex(cHex, centerX - radius, centerY);
  summonHexes();
  
  playNote();
}

function summonHexes(){


  for(let note of notes){
    if(note.isDrawn){
    stroke(0,100,0);
    fill(0,255,0);
    circle(note.x, note.y, size);
    textSize(size/2);
    textAlign(CENTER, CENTER);
    fill(200,255,200);
    text(note.note.toFixed(2), note.x, note.y);
    }
    else{

    }
    
  }
}

function drawHex(root, x, y){
  stroke(0,100,0);
  fill(0,255,0);

  // Precalculate x, y positions for each hex node
  let cx = x;
  let cy = y;

  let rx = x + radius;
  let ry = y;

  let lx = x - radius;
  let ly = y;

  let brx = x + radius / 2;
  let bry = y + (Math.sqrt(3) * radius) / 2;

  let blx = x - radius / 2;
  let bly = y + (Math.sqrt(3) * radius) / 2;

  let tlx = x - radius / 2;
  let tly = y - (Math.sqrt(3) * radius) / 2;

  let trx = x + radius / 2;
  let tryy = y - (Math.sqrt(3) * radius) / 2;

  // Draw circles
  circle(cx, cy, size);     // center
  circle(rx, ry, size);     // right
  circle(lx, ly, size);     // left
  circle(brx, bry, size);   // bottom right
  circle(blx, bly, size);   // bottom left
  circle(tlx, tly, size);   // top left
  circle(trx, tryy, size);  // top right

  
  // Text styling
  textSize(size/2);
  textAlign(CENTER, CENTER);
  fill(200,255,200);

  // Draw note labels
  text(approximateNote(root.note), cx, cy);      // center
  text(approximateNote(root.r), rx, ry);         // right
  text(approximateNote(root.l), lx, ly);         // left
  text(approximateNote(root.br), brx, bry);      // bottom right
  text(approximateNote(root.bl), blx, bly);      // bottom left
  text(approximateNote(root.tl), tlx, tly);      // top left
  text(approximateNote(root.tr), trx, tryy);     // top right

  // Add notes to array
  notes.push(new Note(root.note, cx, cy));      // center
  notes.push(new Note(root.r, rx, ry));         // right
  notes.push(new Note(root.l, lx, ly));         // left
  notes.push(new Note(root.br, brx, bry));        // bottom right
  notes.push(new Note(root.bl, blx, bly));        // bottom left
  notes.push(new Note(root.tl, tlx, tly));        // top left
  notes.push(new Note(root.tr, trx, tryy));        // top right


  // Play Notes
    
}

function playNote() {
  for (let i = 0; i < points.length; i++) {
    let pointer = points[i];
    let played = false;

    for (let note of notes) {
      let d = dist((width-pointer.x), pointer.y, note.x, note.y);
      if (d < size/1.5) { // 20px detection range
        fingerOscs[i].freq(note.note);
        fingerOscs[i].amp(0.4, 0.05); // Smooth fade in
        played = true;
        break;
      }
    }

    if (!played) {
      fingerOscs[i].amp(0, 0.1); // Fade out if not touching anything
    }
  }
}



function drawHands(){
  if(hands.length > 0){
    let pointer = hands[0].index_finger_tip;
    let middle = hands[0].middle_finger_tip;
    let thumb = hands[0].thumb_tip;
    let ring = hands[0].ring_finger_tip;
    let pinky = hands[0].pinky_finger_tip;
    points = [pointer, middle, thumb, ring,pinky]

    for(let tip of points){
      fill(255,0,0, 100);
      circle(width-tip.x, tip.y, size/1.5);
    }

    if(hands.length == 0){
      for(i = 0; i < fingerOscs.length; i++){
        fingerOscs[i].amp(0,0.1);
      }
    }
  }


  
}
