(function() {

class Amp {
  constructor(element, audioCtx) {
    this.audioCtx = audioCtx;
    this.amp = audioCtx.createGain();
    this.amp.gain.value = 0.0;
    this.envelope = new Envelope(element, audioCtx, this.amp.gain);
  }

  get input() {
    return this.amp;
  }

  connect(node) {
    this.amp.connect(node);
  }
}

window.Amp = Amp;

})();
