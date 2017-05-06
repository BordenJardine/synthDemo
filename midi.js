(function() {

const NOTE_ON = 144;
const NOTE_OFF = 128;

class MidiHandler {
  constructor() {
    // listen for midi messages
    navigator.requestMIDIAccess().then(midiAccess => {
      for (var input of midiAccess.inputs.values()) {
        console.log(`found ${input.name}`);
        input.onmidimessage = this.messageReceived.bind(this);
      }
    });
  }

  messageReceived(event) {
    var data = event.data;
    var message = data[0];
    var note = data[1];
    if(!MIDI_NOTES.includes(note)) return;
    if(message == NOTE_ON && typeof this.onnoteon == 'function') {
      this.onnoteon(NOTE_MAP[note]);
    } else if(message == NOTE_OFF && typeof this.onnoteoff == 'function') {
      this.onnoteoff(NOTE_MAP[note]);
    }
  }
}

// midi notes to frequencies
const NOTE_MAP = {
  36: 65.40,
  37: 69.29,
  38: 73.41,
  39: 77.78,
  40: 82.40,
  41: 87.30,
  42: 92.49,
  43: 97.99,
  44: 103.82,
  45: 110.00,
  46: 116.54,
  47: 123.47,
  48: 130.81,
  49: 138.59,
  50: 146.83,
  51: 155.56,
  52: 164.81,
  53: 174.61,
  54: 184.99,
  55: 195.99,
  56: 207.65,
  57: 220.00,
  58: 233.08,
  59: 246.94,
  60: 261.62,
  61: 277.18,
  62: 293.66,
  63: 311.12,
  64: 329.62,
  65: 349.22,
  66: 369.99,
  67: 391.99,
  68: 415.30,
  69: 440.00,
  70: 466.16,
  71: 493.88,
  72: 523.25,
  73: 554.36,
  74: 587.32,
  75: 622.25,
  76: 659.25,
  77: 698.45,
  78: 739.98,
  79: 783.99,
  80: 830.60,
  81: 880.00,
  82: 932.32,
  83: 987.76,
  84: 1046.50,
  85: 1108.73,
  86: 1174.65,
  87: 1244.50,
  88: 1318.51,
  89: 1396.91,
  90: 1479.97,
  91: 1567.98,
  92: 1661.21,
  93: 1760.00,
  94: 1864.65,
  95: 1975.53,
  96: 2093.00,
  97: 2217.46,
  98: 2349.31,
  99: 2489.01,
  100: 2637.02,
  101: 2793.82,
  102: 2959.95,
  103: 3135.96,
  104: 3322.43,
  105: 3520.00,
  106: 3729.31,
  107: 3951.06
};

const MIDI_NOTES = Object.keys(NOTE_MAP).map(Number);

window.MidiHandler = MidiHandler;

})();
