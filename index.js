window.onload = function(){

// create web audio api context
var audioCtx = new window.AudioContext();

//setup canvas for scope
var canvas = document.querySelector('.scope');
var canvasCtx = canvas.getContext("2d");

// create Oscillator node
var oscillator = audioCtx.createOscillator();

oscillator.type = 'square';
oscillator.frequency.value = 220; // value in hertz
oscillator.start();

var gainNode = audioCtx.createGain();
gainNode.gain.value = 0.5;

//Create analyser
var analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

// connect our nodes

oscillator.connect(gainNode);
gainNode.connect(analyser);
analyser.connect(audioCtx.destination);


// draw an oscilloscope
function drawScope() {
  var width = canvas.width;
  var height = canvas.height;
  var timeData = new Uint8Array(analyser.frequencyBinCount);
  var scaling = height / 256;
  var risingEdge = 0;
  var edgeThreshold = 5;

  analyser.getByteTimeDomainData(timeData);

  canvasCtx.fillStyle = 'rgb(10, 30, 10)';
  canvasCtx.fillRect(0, 0, width, height);

  canvasCtx.lineWidth = 5;
  canvasCtx.strokeStyle = 'rgb(0, 50, 0)';
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, height / 2);
  canvasCtx.lineTo(width, height / 2);
  canvasCtx.stroke();

  canvasCtx.lineWidth = 3;
  canvasCtx.strokeStyle = 'rgb(0, 200, 0)';
  canvasCtx.beginPath();

  // No buffer overrun protection
  while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
  if (risingEdge >= width) risingEdge = 0;

  while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
  if (risingEdge >= width) risingEdge = 0;

  for (var x = risingEdge; x < timeData.length && x - risingEdge < width; x++)
    canvasCtx.lineTo(x - risingEdge, height - timeData[x] * scaling);

  canvasCtx.stroke();
  requestAnimationFrame(drawScope);
}

drawScope();

};

