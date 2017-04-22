(function() {

const ANALYSER_FFT_SIZE = 256;
const BG_COLOR = 'rgb(10, 30, 10)';
const BAR_COLOR = 'rgb(30, 200, 30)';

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

    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    console.log(this.bufferLength);
    this.barWidth = (this.width / this.bufferLength) * 2.5;

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
    // clear the screen
    this.canvasCtx.fillStyle = BG_COLOR;
    this.canvasCtx.fillRect(0, 0, this.width, this.height);

    this.analyser.getByteFrequencyData(this.dataArray);
    var barHeight;
    var x = 0;

    for(var i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i];

      this.canvasCtx.fillStyle = BAR_COLOR;
      this.canvasCtx.fillRect(x,this.height-barHeight/2,this.barWidth,barHeight);

      x += this.barWidth + 1;
    }

    if (this.enabled) requestAnimationFrame(this.drawGraph);
  }
}

window.FrequencyGraph = FrequencyGraph;

})();
