(function() {

const DEFAULT_GAIN = 0.5;
const STARTING_FREQ = 50; // value in hertz
const WAVEFORMS = [
  'square',
  'sawtooth',
  'sine'
];

class LFO {

  constructor(element, audioCtx) {
    this.element = element;
    this.audioCtx = audioCtx;

    this.currentConnection = null;
    this.currentFreq = STARTING_FREQ;

    // create a web audio oscillator
    this.oscillator = audioCtx.createOscillator();
    this.oscillator.frequency.value = this.currentFreq;
    this.oscillator.type = WAVEFORMS[0];
    // connect it to a web audio gain node
    this.gainNode = audioCtx.createGain();
    this.gainNode.gain.value = DEFAULT_GAIN;
    this.oscillator.connect(this.gainNode);

    this.oscillator.start();

    // hook up some controls

    // waveform selector
    this.updateWaveform = this.updateWaveform.bind(this);
    this.waveformControls = element.querySelectorAll('.waveformControl');
    this.waveformControls.forEach(waveformControl => {
      waveformControl.onchange = this.updateWaveform;
    });

    // volume control
    this.updateIntensity = this.updateIntensity.bind(this);
    this.intensityControl = element.querySelector('.intensityControl');
    this.intensityControl.oninput = this.updateIntensity;

    this.updateFrequency = this.updateFrequency.bind(this);
    this.frequencyControl = element.querySelector('.frequencyControl');
    this.frequencyControl.oninput = this.updateFrequency;
  }

  // lfo is expected to connect to an audio parameter rather than a node
  connect(audioParam) {
    this.gainNode.connect(audioParam);
    this.currentConnection = audioParam;
  }

  disconnect() {
    if (!this.currentConnection) return;
    this.gainNode.disconnect(this.currentConnection);
  }

  updateWaveform() {
    this.waveformControls.forEach(waveformControl => {
      if (waveformControl.checked) {
        this.oscillator.type = waveformControl.value;
      };
    });
  }

  updateIntensity() {
    this.gainNode.gain.value = +this.intensityControl.value;
  }

  updateFrequency() {
    this.oscillator.frequency.value = this.frequencyControl.value;
  }
}

window.LFO = LFO;

})();
