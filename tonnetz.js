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

class Note{
    constructor(note, x, y){
        this.note = note;
        this.x = x;
        this.y = y;
    }
}