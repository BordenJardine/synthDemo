window.onload = function() {

var mode = 'sawtooth';
var wavesControl = document.querySelector('.wavesControl');
var modeControls = document.querySelectorAll('.modeControl');
var wavesDisplay = document.querySelector('.wavesDisplay');
var scopeElement = document.querySelector('.scope');
var frequenciesDisplay = document.querySelector('.frequencies');

var audioCtx = new window.AudioContext();

// set up out oscilloscope
var scope = new Scope(scopeElement, audioCtx);
scope.connect(audioCtx.destination);

// set up a master gain
var gain = audioCtx.createGain();
gain.gain.value = 1;
gain.connect(scope.input);

// which waves are involved?
var fundamental = 220;
var frequencies = [];
var frequencyCount = 1;
var oscs = [];
var maxFrequencies = 66;

var setup = function() {
  frequencyCount = 1;
  // generate frequencies
  frequencies = [];
  let j = 1;
  for (let i = 1; j <= maxFrequencies; i++) {
    // squares only get odd harmonics!
    if (mode == 'sawtooth' || i % 2 != 0) {
      frequencies.push(fundamental * i);
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
  console.log(mode);
};
modeControls.forEach(control => control.onchange = updateMode);

var updateWaveCount = function() {
  var oldFrequencyCount = frequencyCount;
  frequencyCount = wavesControl.value;
  wavesDisplay.innerHTML = frequencyCount;

  // clear old oscillators
  oscs.forEach(osc => {
    osc.stop;
    osc.disconnect(gain);
  });
  oscs = [];

  gain.gain.value = (0.5 / frequencyCount);
  // create new oscillators
  for (let i = 0; i < frequencyCount; i++) {
    let osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequencies[i];
    osc.connect(gain);
    osc.start();
    oscs.push(osc);
  }

  // update frequencies display
  frequenciesDisplay.innerHTML = 'frequencies: ' + frequencies.slice(0, frequencyCount).join(", ");
};
wavesControl.oninput = updateWaveCount;

setup();
};

