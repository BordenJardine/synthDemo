(function() {

const MULTIPLIER = 0.1;
const STROKE_COLOR = 'rgb(33, 33, 33)';
const LINE_WIDTH = 5;
const MIN_SUSTAIN_WIDTH = 10;
const MARGIN = 10;

class Amp {

  constructor(element, audioCtx) {
    this.amp = audioCtx.createGain();
    this.attack = 25;
    this.decay = 25;
    this.sustain = 50;
    this.release = 25;
    this.currentNote = null;

    // controls
    this.attackControl = element.querySelector('.attackControl');
    this.decayControl = element.querySelector('.decayControl');
    this.sustainControl = element.querySelector('.sustainControl');
    this.releaseControl = element.querySelector('.releaseControl');
    this.controls = [
      this.attackControl,
      this.decayControl,
      this.sustainControl,
      this.releaseControl
    ];
    this.controls.forEach(control => control.oninput = this.updateADSR.bind(this));

    // pretty graph
    var canvas = element.querySelector('.ADSRGraph');
    this.canvasCtx = canvas.getContext("2d");
    this.canvasWidth = canvas.width - MARGIN;
    this.canvasHeight = canvas.height - MARGIN;
    this.drawADSRGraph = this.drawADSRGraph.bind(this);
    this.updateADSR();
  }

  get input() {
    return this.amp;
  }

  connect(node) {
    this.amp.connect(node);
  }

  updateADSR() {
    this.attack = +this.attackControl.value;
    this.decay = +this.decayControl.value;
    this.sustain = +this.sustainControl.value;
    this.release = +this.releaseControl.value;
    this.drawADSRGraph();
  }

  trigger(note) {
    this.currentNote = note;
    let amp = this.amp;
    let now = audioCtx.currentTime();
    let attack = this.attack * MULTIPLIER;
    let decay = this.decay * MULTIPLIER;
    let sustain = this.sustain * 0.01;
    amp.gain.setValueAtTime(0.0, now);
    amp.gain.linearRampToValueAtTime(1.0, now + attack);
    amp.gain.linearRampToValueAtTime(sustain, now + attack + decay);
  }

  release(note) {
    if (this.currentNote != note) return;
    let release = this.release * MULTIPLIER;
    amp.gain.linearRampToValueAtTime(0.0, release);
  }

  drawADSRGraph() {
    // debugger;
    var valueMax = this.canvasWidth / 4;

    var percent = function(x) {
      return x * valueMax / 100;
    };

    var attack = percent(this.attack) + MARGIN;
    var decay = percent(this.decay);
    var release = percent(this.release);
    // sustain gets the rest
    var sustainW = this.canvasWidth - (attack + decay + release);
    var sustainH = this.canvasHeight - (this.sustain * this.canvasHeight / 100);

    this.canvasCtx.clearRect(0, 0, this.canvasWidth + MARGIN, this.canvasHeight + MARGIN);
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = LINE_WIDTH;
    this.canvasCtx.strokeStyle = STROKE_COLOR;
    this.canvasCtx.moveTo(5, this.canvasHeight);
    this.canvasCtx.lineTo(attack, MARGIN);
    this.canvasCtx.lineTo(attack + decay, sustainH);
    this.canvasCtx.lineTo(attack + decay + sustainW, sustainH);
    this.canvasCtx.lineTo(this.canvasWidth, this.canvasHeight);
    this.canvasCtx.stroke();
  }
}

window.Amp = Amp;

})();
