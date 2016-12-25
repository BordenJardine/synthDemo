(function() {

const DEFAULT_GAIN = 0.5;
const STARTING_FREQ = 440; // value in hertz
const WAVEFORMS = [
  'sawtooth',
  'square',
  'sine'
];

class Osc {
  constructor(element, audioCtx) {
    this.oscillator = audioCtx.createOscillator();
    this.oscillator.frequency.value = STARTING_FREQ;
    this.oscillator.type = WAVEFORMS[0];
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = DEFAULT_GAIN;
    this.oscillator.connect(this.gainNode);
    var scopeCanvas = element.querySelector('.scope');
    this.scope = new Scope(scopeCanvas, audioCtx);
    this.gainNode.connect(this.scope.input);
    this.oscillator.start();
  }

  connect(node) {
    this.gainNode.connect(node);
  }
}

window.Osc = Osc;

})();
