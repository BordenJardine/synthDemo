(function() {

const DEFAULT_GAIN = 0.5;
const STARTING_FREQ = 440; // value in hertz
const WAVEFORMS = [
  'square',
  'sawtooth',
  'sine'
];

class Osc {
  constructor(element, audioCtx) {
    this.element = element;

    // create a web audio oscillator
    this.oscillator = audioCtx.createOscillator();
    this.oscillator.frequency.value = STARTING_FREQ;
    this.oscillator.type = WAVEFORMS[0];
    // connect it to a web audio gain node
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = DEFAULT_GAIN;
    this.oscillator.connect(this.gainNode);

    // create a lil oscilloscope for this oscillator
    var scopeCanvas = element.querySelector('.scope');
    this.scope = new Scope(scopeCanvas, audioCtx);
    this.gainNode.connect(this.scope.input);
    this.oscillator.start();

    //hook up some controls
    this.updateWaveform = this.updateWaveform.bind(this);
    this.waveformControls = element.querySelectorAll('.waveformControl');
    this.waveformControls.forEach(waveformControl => {
      waveformControl.onclick = this.updateWaveform;
    });
  }

  connect(node) {
    this.gainNode.connect(node);
  }

  updateWaveform() {
    this.waveformControls.forEach(waveformControl => {
      if (waveformControl.checked) {
        this.oscillator.type = waveformControl.value;
      };
    });
  }
}

window.Osc = Osc;

})();
