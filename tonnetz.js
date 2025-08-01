//BOTTOM RIGHT IS MAJOR THIRDS
//TOP RIGHT IS MINOR THIRDS
//RIGHTWARD IS FIFTHS


class Node{
    constructor(note, l, r, tl, tr, bl, br){
    this.note = note;
    this.l = l;
    this.r = r;
    this.tl = tl;
    this.tr = tr;
    this.bl = bl;
    this.br = br; 
    }
    
}

class NodeHex{
    constructor(root, l, r, tl, tr, bl, br){
        this.root = root;
        this.l = l;
        this.r = r;
        this.tl = tl;
        this.tr = tr;
        this.bl = bl;
        this.br = br;
    }
}
class Note{
    constructor(note, x, y, notDrawn){
        this.note = note;
        this.x = x;
        this.y = y;
        this.notDrawn = notDrawn || false; // Default to false if not provided
    }
}

function trimmedNotes(notes) {
    let seenFreqs = new Set();
    if (notes.length === 0) {
        return [];
    }

    for(i = notes.length; i >= 0; i++) {
        console.log(notes[i]);
        const current = notes[i];
        const noteFreq = current.note.toFixed(4);
        if(seenFreqs.has(noteFreq)){
            current.notDrawn = false; // Mark as not drawn
        }
        else{
            seenFreqs.add(noteFreq);
            current.notDrawn = true; // Mark as drawn
        }
    }

    return Array.from(seenFreqs);
}


function createHex(freq, rootx, rooty, dist, hexes){
    let x = rootx;
    let y = rooty;
    let radius = dist;
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

    return new NodeHex(
        new Note(freq, x, y),
        new Note(freq * FIFTH_DOWN, lx, ly),
        new Note(freq * FIFTH_UP, rx, ry),
        new Note(freq * MINOR_UP, tlx, tly),
        new Note(freq * MAJOR_UP, trx, tryy),
        new Note(freq * MAJOR_DOWN, blx, bly),
        new Note(freq * MINOR_DOWN, brx, bry)
    )
    
    
}

function createHexes(freq, x, y, dist, amount, hexes){
    if (amount <= 0){return;}
    let hex = createHex(freq, x, y, dist);
    console.log(hex);
    hexes.push(hex);
    console.log(hexes);
      // center note
    for(const key in hex){
        //if(key == "root"){continue;}
        let note = hex[key];
        createHexes(note.note, note.x, note.y, dist, amount - 1, hexes);
        
    }
}



const FIFTH_UP = 3/2;
const FIFTH_DOWN = 2/3;
const MAJOR_UP = 5/4;
const MAJOR_DOWN = 4/5;
const MINOR_UP = 6/5;
const MINOR_DOWN = 5/6;

function makeHex(base){
    return new Node(
        base,                         // note
        base * FIFTH_DOWN,            // l (Perfect 4th)
        base * FIFTH_UP,              // r (Perfect 5th)
        base * MINOR_UP,              // tl (Minor 3rd up)
        base * MAJOR_UP,              // tr (Major 3rd up)
        base * MAJOR_DOWN,            // bl (Major 3rd down)
        base * MINOR_DOWN             // br (Minor 3rd down)
    );
}

function generateHexes(base, count){
    if(count == 0){return;}
    if(count == 1){
        return new Node(
        base,                         // note
        base * FIFTH_DOWN,            // l (Perfect 4th)
        base * FIFTH_UP,              // r (Perfect 5th)
        base * MINOR_UP,              // tl (Minor 3rd up)
        base * MAJOR_UP,              // tr (Major 3rd up)
        base * MAJOR_DOWN,            // bl (Major 3rd down)
        base * MINOR_DOWN             // br (Minor 3rd down)
    );
    }
    else{
        generateHexes();
        return new Node(
        base,                         // note
        base * FIFTH_DOWN,            // l (Perfect 4th)
        base * FIFTH_UP,              // r (Perfect 5th)
        base * MINOR_UP,              // tl (Minor 3rd up)
        base * MAJOR_UP,              // tr (Major 3rd up)
        base * MAJOR_DOWN,            // bl (Major 3rd down)
        base * MINOR_DOWN             // br (Minor 3rd down)
    );
    }
}


function approximateNote(freq){
  let midiValue = freqToMidi(freq);
  return midiToNoteName(Math.round(midiValue));
}

function midiToNoteName(midi) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let note = noteNames[midi % 12];
  let octave = Math.floor(midi / 12) - 1; // MIDI 60 = C4, MIDI 69 = A4
  return note + octave;
}

