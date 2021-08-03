window.onload = function() {
document.querySelector('#start').onclick = function() {

var mode = 'sawtooth';
var wavesControl = document.querySelector('.wavesControl');
var modeControls = document.querySelectorAll('.modeControl');
var wavesDisplay = document.querySelector('.wavesDisplay');
var scopeElement = document.querySelector('.scope');
var frequenciesDisplay = document.querySelector('.frequencies');
var lookahead = 0.0;

var audioCtx = new window.AudioContext();

// set up out oscilloscope
var scope = new Scope(scopeElement, audioCtx);
scope.connect(audioCtx.destination);

// set up a master gain
var masterGain = audioCtx.createGain();
masterGain.gain.value = 0.5;
masterGain.connect(scope.input);

// which waves are involved?
var fundamental = 440;
var frequencies = [];
var frequencyCount = 1;
var oscs = [];
var gains = [];
var maxFrequencies = 50;

var setup = function() {
  // generate frequencies
  frequencies = [];
  let j = 1;
  for (let i = 1; j <= maxFrequencies; i++) {
    // squares only get odd harmonics!
    if (mode == 'sawtooth' || i % 2 != 0) {
      frequencies.push({
        freq: fundamental * i,
        gain: 1 / i
      });
      j++;
    }
  }
  updateWaveCount();
};

var updateMode = function() {
  var oldMode = mode;
  modeControls.forEach(control => {
    if (control.checked) mode = control.value;
  });
  if (oldMode != mode) {
    setup();
  }
};
modeControls.forEach(control => control.onchange = updateMode);

var updateWaveCount = function() {
  var oldFrequencyCount = frequencyCount;
  frequencyCount = wavesControl.value;
  wavesDisplay.innerHTML = frequencyCount;

  // clear old oscillators
  oscs.forEach(osc => {
    osc.stop;
    osc.disconnect();
  });
  gains.forEach(gain => gain.disconnect());

  oscs = [];
  gains = [];

  //gain.gain.value = (0.5 / frequencyCount);
  // create new oscillators
  var startTime = audioCtx.currentTime + lookahead;
  for (let i = 0; i < frequencyCount; i++) {
    let osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequencies[i].freq;

    let gain = audioCtx.createGain();
    gain.gain.value = frequencies[i].gain;
    osc.connect(gain);
    osc.start(startTime);

    gain.connect(masterGain);

    oscs.push(osc);
    gains.push(gain);
  }

  // update frequencies display
  let freqList = frequencies.slice(0, frequencyCount).map(f => f.freq).join(", ");
  frequenciesDisplay.innerHTML = 'frequencies: ' + freqList;
};
wavesControl.oninput = updateWaveCount;

setup();
};
};

