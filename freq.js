(function() {

const ANALYSER_FFT_SIZE = 256;
const BG_COLOR = 'rgb(10, 30, 10)';

class FrequencyGraph {
  constructor(canvas, audioCtx) {
    this.canvas = canvas;
    this.audioCtx = audioCtx;
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = ANALYSER_FFT_SIZE;
    this.canvasCtx = canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.drawGraph = this.drawGraph.bind(this);
    this.enabled = true;
    this.drawGraph();
  }

  get input() {
    return this.analyser;
  }

  connect(node) {
    this.analyser.connect(node);
  }

  disconnect(node) {
    this.analyser.disconnect(node);
  }

  enable() {
    this.enabled = true;
    this.drawGraph();
  }

  disable() {
    this.enabled = false;
  }

  drawGraph() {
    if (this.enabled) requestAnimationFrame(this.drawGraph);
  }
}

window.FrequencyGraph = FrequencyGraph;

})();
