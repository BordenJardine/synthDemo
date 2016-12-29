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

    this.currentFreq = STARTING_FREQ;
    // change the frequency by this
    this.octaveMultiplier = 1;

    // create a web audio oscillator
    this.oscillator = audioCtx.createOscillator();
    this.oscillator.frequency.value = this.currentFreq;
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

    // hook up some controls

    // waveform selector
    this.updateWaveform = this.updateWaveform.bind(this);
    this.waveformControls = element.querySelectorAll('.waveformControl');
    this.waveformControls.forEach(waveformControl => {
      waveformControl.onchange = this.updateWaveform;
    });

    // octave selector
    this.updateOctave = this.updateOctave.bind(this);
    this.octaveControl = element.querySelector('.octaveControl');
    this.octaveControl.onchange = this.updateOctave;

    // volume control
    this.updateVolume = this.updateVolume.bind(this);
    this.volumeControl = element.querySelector('.volumeControl');
    this.volumeControl.onchange = this.updateVolume;
  }

  set freq(freq) {
    this.currentFreq = freq;
    this.oscillator.frequency.value = this.currentFreq * this.octaveMultiplier;
  }

  get freq() {
    return this.currentFreq;
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

  updateOctave() {
    switch (+this.octaveControl.value) {
      case -1:
        this.octaveMultiplier = 0.5;
        break;
      case 0:
        this.octaveMultiplier = 1;
        break;
      case 1:
        this.octaveMultiplier = 2;
        break;
    }
    this.freq = this.currentFreq;
  }

  updateVolume() {
    this.gainNode.gain.value = +this.volumeControl.value;
  }
}

window.Osc = Osc;

})();
