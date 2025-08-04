//Global Variables
let centerX;
let centerY;
const radius = 120;
const size = radius / 2;
let rootNote = 233.33;
let handPose;
let video;
let hands = []; // Array to hold hands
let points = []; //Points of note hand
let orch = []; //Points of hand for chord voicing
let notes = [];
let osc;
let fingerOscs = [];
let hexes = [];
let isMajor = false;
let isMinor = false;
let freq1 = 0;
let freq2 = 0;
let freq3 = 0;
let font;
let deadmobzerfont;

function preload() {
    handPose = ml5.handPose();
    font = loadFont('resources/soopafre.ttf');
    deadmobzerfont = loadFont('resources/mephisto.ttf');
}

function setup() {
    textFont(font);
    if (getAudioContext.state != 'running') { getAudioContext().resume(); }
    createCanvas(windowWidth, windowHeight);

    newRoot = parseFloat(prompt("Enter a note to generate from:", rootNote));
    if (newRoot) {
        rootNote = newRoot;
    }
    if (isNaN(rootNote)) {
        if (confirm("You need to enter a number. Press okay to refresh page and try again")) {
            location.reload();
        }
    }

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    handPose.detectStart(video, gotHands);
    centerX = width / 2;
    centerY = height / 2;

    for (let i = 0; i < 5; i++) {
        let osc = new p5.Oscillator('sine');
        osc.start();
        osc.amp(0);
        fingerOscs.push(osc);
    }

    let drone = new p5.Oscillator('sine');
    drone.start();
    drone.freq(rootNote / 4);
    drone.amp(0.4);

    createHexes(rootNote, centerX, centerY, radius, 3, hexes);
    for (hex of hexes) {
        for (const key in hex) {
            let note = hex[key];
            notes.push(new Note(note.note, note.x, note.y));
        }
    }


    let coords = [];
    for (let note of notes) {
        console.log("Note: " + note.note + ", X: " + note.x + ", Y: " + note.y);
        if (coords.some(coord => coord.x === note.x && coord.y === note.y)) {
            note.isDrawn = false;
            console.log("Note already drawn at: " + note.x + ", " + note.y);
        } else {
            coords.push({ x: note.x, y: note.y });
            note.isDrawn = true;
        }

    }

}

function gotHands(returns) {
    hands = returns;
    console.log(returns);
}

function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
    background(10, 10, 10, 100);
    if (points.length > 3) {
        background(points[1].x, rootNote, points[1].y, 80)
    }

    drawHands();
    summonHexes();

    playNote();
    textFont(font);
    textAlign(RIGHT, BOTTOM);
    fill(255, 255, 255, 50);
    noStroke();
    textSize(size / 2);
    text("tonnetz", 0.99 * width, (0.99 * height) - 1.1 * (size / 2));
    textFont(deadmobzerfont);
    text("by deadmobzer", 0.99 * width, 0.99 * height);


}

/*
Function to draw hexes based on global array of notes
*/
function summonHexes() {
    for (let note of notes) {
        if (note.isDrawn) {
            strokeWeight(3);
            stroke(255, 10);
            let norm = abs((note.x - width / 2) / (width / 2))

            let intensity = 64 + (1 - norm) * (255 - 64)
            let y_intest = 255 - (255 * abs((note.y - height / 2) / (height / 2)))
            fill(255 - intensity, y_intest, intensity, 100);
            if (points.length > 3) {
                fill(points[1].x - intensity, rootNote - y_intest, points[1].y - intensity, 100)
            }
            circle(note.x, note.y, size);
            noStroke();
            textFont(font);
            textSize(size / 3);
            textAlign(CENTER, CENTER);
            fill(255, 255, 255);
            text(approximateNote(note.note), note.x, note.y);
        } else {}
    }
}


/*
Function to play note based on hand position and note x,y coordinates
If the hand is touching a note, it plays the note; If there is 2 hands
it plays a chord based on the hand positions;
If no hands are detected, it fades out the oscillators;
*/
function playNote() {
    if (isMajor) {
        let pointer = points[0];
        for (let note of notes) {
            let d = dist((width - pointer.x), pointer.y, note.x, note.y);
            if (d < size / 1.5) { // 20px detection range
                fingerOscs[0].freq(note.note);
                fingerOscs[0].amp(0.4, 0.05); // Smooth fade in
                fingerOscs[1].freq(note.note * 3 / 2);
                fingerOscs[1].amp(0.4, 0.05); // Smooth fade in
                fingerOscs[2].freq(note.note * 5 / 4);
                fingerOscs[2].amp(0.4, 0.05); // Smooth fade in
                for (let i = 3; i < fingerOscs.length; i++) {
                    fingerOscs[i].amp(0, 0.1)
                }
                break;
            }
        }
    } else if (isMinor) {
        let pointer = points[0];
        for (let note of notes) {
            let d = dist((width - pointer.x), pointer.y, note.x, note.y);
            if (d < size / 1.5) { // 20px detection range
                fingerOscs[0].freq(note.note);
                fingerOscs[0].amp(0.4, 0.05); // Smooth fade in
                fingerOscs[1].freq(note.note * 3 / 2);
                fingerOscs[1].amp(0.4, 0.5); // Smooth fade in
                fingerOscs[2].freq(note.note * 5 / 6);
                fingerOscs[2].amp(0.4, 0.5); // Smooth fade in
                played = true;
                for (let i = 3; i < fingerOscs.length; i++) {
                    fingerOscs[i].amp(0, 0.1)
                }
                break;
            }
        }
    } else {
        for (let i = 0; i < points.length; i++) {
            let pointer = points[i];
            let played = false;

            for (let note of notes) {
                let d = dist((width - pointer.x), pointer.y, note.x, note.y);
                if (d < size / 1.5) { // 20px detection range
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
    if (points.length == 0) {
        return [];
    }
}

/*
Draws the hands on the screen, and determines if the chord is major or minor
*/
function drawHands() {
    console.log("isMajor: " + isMajor);
    console.log("isMinor: " + isMinor);
    if (hands.length == 1) {
        let pointer = hands[0].index_finger_tip;
        let middle = hands[0].middle_finger_tip;
        let thumb = hands[0].thumb_tip;
        let ring = hands[0].ring_finger_tip;
        let pinky = hands[0].pinky_finger_tip;
        points = [pointer, middle, thumb, ring, pinky]
    }
    if (hands.length == 2) {
        for (let hand of hands) {
            if (hand.handedness == "Left") {
                let pointer = hand.index_finger_tip;
                let middle = hand.middle_finger_tip;
                let thumb = hand.thumb_tip;
                let ring = hand.ring_finger_tip;
                let pinky = hand.pinky_finger_tip;
                points = [pointer, middle, thumb, ring, pinky]
            }

            if (hand.handedness == "Right") {
                let pointer2 = hands[1].index_finger_tip;
                let middle2 = hands[1].middle_finger_tip;
                let pointer2b = hands[1].index_finger_mcp;
                let middle2b = hands[1].middle_finger_mcp;
                orch = [pointer2, middle2, pointer2b, middle2b];
                console.log(pointer2.y);
                console.log(pointer2b.y);
                if (pointer2.y <= pointer2b.y - 20) {
                    if (middle2.y <= middle2b.y - 20) {
                        isMinor = true;
                        isMajor = false;
                    } else {
                        isMajor = true;
                        isMinor = false;
                    }
                } else {
                    isMajor = false;
                    isMinor = false;
                }
            }
        }
    }
    for (let tip of points) {
        fill(255, 0, 0, 100);
        circle(width - tip.x, tip.y, size / 1.5);
    }

    if (hands.length > 1) {
        for (let point of orch) {
            fill(0, 0, 255, 100);
            circle(width - point.x, point.y, size / 1.5);
        }
    }
    if (hands.length == 0) {
        for (i = 0; i < fingerOscs.length; i++) {
            fingerOscs[i].amp(0, 0.1);
        }
        return;
    }

}