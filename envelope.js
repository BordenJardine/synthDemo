(function() {

// scale the ADSR values
const MULTIPLIER = 0.01;

  //graph stuff
const ATTACK_COLOR = '#ff4242';
const DECAY_COLOR = '#55b377';
const SUSTAIN_COLOR = '#6666ee';
const RELEASE_COLOR = '#cc66cc';
const LINE_WIDTH = 5;
const MIN_SUSTAIN_WIDTH = 10;
const MARGIN = 10;

class Envelope {
  constructor(element, audioCtx, audioParam) {
    this.audioCtx = audioCtx;
    this.audioParam = audioParam;

    //ADSR stuff
    this.attack = 25;
    this.decay = 25;
    this.sustain = 50;
    this.release = 25;
    this.currentNote = null;
    this.maxValue = 1.0;

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
    var graphCanvas = element.querySelector('.ADSRGraph'); 
    this.canvasCtx = graphCanvas.getContext("2d");
    this.canvasWidth = graphCanvas.width - MARGIN;
    this.canvasHeight = graphCanvas.height - MARGIN;
    this.drawADSRGraph = this.drawADSRGraph.bind(this);
    this.updateADSR();
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
    let now = this.audioCtx.currentTime;
    let attack = this.attack * MULTIPLIER;
    let decay = this.decay * MULTIPLIER;
    // sustain is a %age
    let sustain = this.maxValue * (this.sustain * MULTIPLIER);

    this.audioParam.cancelScheduledValues(0);
    this.audioParam.linearRampToValueAtTime(this.maxValue, now + attack);
    this.audioParam.linearRampToValueAtTime(sustain, now + attack + decay);
  }

  releaseNote(note) {
    if (this.currentNote != note) return;
    let release = this.audioCtx.currentTime + (this.release * MULTIPLIER);

    this.audioParam.cancelScheduledValues(0);
    this.audioParam.linearRampToValueAtTime(0.0, release);
  }

  drawADSRGraph() {
    var valueMax = this.canvasWidth / 4;

    var percent = function(x) {
      return x * valueMax / 100;
    };

    var attack = percent(this.attack) + MARGIN;
    var decay = percent(this.decay);
    var release = percent(this.release);
    // sustain gets the rest
    var sustainW = this.canvasWidth - (attack + decay + release);
    var sustainH = this.canvasHeight - (this.sustain * this.canvasHeight / 100) + MARGIN;
    if (sustainH > this.canvasHeight) sustainH = this.canvasHeight;

    this.canvasCtx.clearRect(0, 0, this.canvasWidth + MARGIN, this.canvasHeight + MARGIN);
    this.canvasCtx.lineWidth = LINE_WIDTH;

    this.canvasCtx.strokeStyle = ATTACK_COLOR;
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(5, this.canvasHeight);
    this.canvasCtx.lineTo(attack, MARGIN);
    this.canvasCtx.stroke();

    this.canvasCtx.strokeStyle = DECAY_COLOR;
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(attack, MARGIN);
    this.canvasCtx.lineTo(attack + decay, sustainH);
    this.canvasCtx.stroke();

    this.canvasCtx.strokeStyle = SUSTAIN_COLOR;
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(attack + decay, sustainH);
    this.canvasCtx.lineTo(attack + decay + sustainW, sustainH);
    this.canvasCtx.stroke();

    this.canvasCtx.strokeStyle = RELEASE_COLOR;
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(attack + decay + sustainW, sustainH);
    this.canvasCtx.lineTo(this.canvasWidth, this.canvasHeight);
    this.canvasCtx.stroke();
  }
}

window.Envelope = Envelope;
})();
