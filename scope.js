(function() {

const ANALYSER_FFT_SIZE = 2048;
const RESOLUTION = 256;
const EDGE_THRESHOLD = 5;
const BG_COLOR = 'rgb(10, 30, 10)';
const CENTER_LINE_COLOR = 'rgb(0, 50, 0)';
const STROKE_COLOR = 'rgb(0, 200, 0)';
const LINE_WIDTH = 3;

class Scope {
  constructor(canvas, audioCtx) {
    this.canvas = canvas;
    this.audioCtx = audioCtx;
    this.analyser = audioCtx.createAnalyser();
    this.analyser.fftSize = ANALYSER_FFT_SIZE;
    this.canvasCtx = canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.scaling = this.height / RESOLUTION;
    this.drawScope = this.drawScope.bind(this);
    this.enabled = true;
    this.drawScope();
  }

  get input() {
    return this.analyser;
  }

  connect(node) {
    this.analyser.connect(node);
  }

  disconnect(node) {
    this.analyser.disconnect(node);
  };

  enable() {
    this.enabled = true;
    this.drawScope();
  }

  disable() {
    this.enabled = false;
  }

  drawScope() {
    var timeData = new Uint8Array(this.analyser.frequencyBinCount);
    var risingEdge = 0;

    this.analyser.getByteTimeDomainData(timeData);

    this.canvasCtx.fillStyle = BG_COLOR;
    this.canvasCtx.fillRect(0, 0, this.width, this.height);

    this.canvasCtx.lineWidth = LINE_WIDTH;
    this.canvasCtx.strokeStyle = CENTER_LINE_COLOR;
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(0, this.height / 2);
    this.canvasCtx.lineTo(this.width, this.height / 2);
    this.canvasCtx.stroke();

    this.canvasCtx.lineWidth = LINE_WIDTH;
    this.canvasCtx.strokeStyle = STROKE_COLOR;
    this.canvasCtx.beginPath();

    // buffer overrun protection
    while (timeData[risingEdge++] - RESOLUTION / 2 > 0 && risingEdge <= this.width);
    if (risingEdge >= this.width) risingEdge = 0;

    while (timeData[risingEdge++] - RESOLUTION / 2 < EDGE_THRESHOLD && risingEdge <= this.width);
    if (risingEdge >= this.width) risingEdge = 0;

    for (var x = risingEdge; x < timeData.length && x - risingEdge < this.width; x++) {
      this.canvasCtx.lineTo(x - risingEdge, this.height - timeData[x] * this.scaling);
    }

    this.canvasCtx.stroke();
    if(this.enabled) requestAnimationFrame(this.drawScope);
  }
}

window.Scope = Scope;

})();
