window.onload = function(){

var audioCtx = new window.AudioContext();

var oscElement1 = document.querySelector('.osc1');
var oscillator1 = new Osc(oscElement1, audioCtx);

var oscElement2 = document.querySelector('.osc2');
var oscillator2 = new Osc(oscElement2, audioCtx);

var lfoElement = document.querySelector('.lfo');
var lfo = new LFO(lfoElement, audioCtx);

var filterElement = document.querySelector('.filter');
var filter = new Filter(filterElement, audioCtx);

var ampElement = document.querySelector('.amp');
var amp = new Amp(ampElement, audioCtx);

var scopeElement = document.querySelector('.scopeModule');
var doubleScope = new DoubleScope(scopeElement, audioCtx);

oscillator1.connect(amp.input);
oscillator2.connect(amp.input);

amp.connect(filter.input);
doubleScope.monitor(filter.input);

filter.connect(audioCtx.destination);

var envelopes = [amp.envelope, filter.envelope];

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => {
  oscillator1.freq = frequency;
  oscillator2.freq = frequency;
  envelopes.forEach(envelope => envelope.trigger(frequency));
});

midiHandler.onnoteoff = (frequency => {
  envelopes.forEach(envelope => envelope.releaseNote(frequency));
});

// Routing for the LFO
var lfoControls = lfoElement.querySelectorAll('.destinationControl');
var updateLFO = function() {
  lfoControls.forEach(destinationControl => {
    if (destinationControl.checked) {
      lfo.disconnect();
      switch(destinationControl.value) {
        case 'pitch':
          lfo.multiplier = 10;
          lfo.connect(oscillator1.oscillator.frequency);
          lfo.connect(oscillator2.oscillator.frequency);
          break;
        case 'volume':
          lfo.multiplier = 1;
          lfo.connect(amp.amp.gain);
          break;
        case 'cutoff':
          lfo.multiplier = 10000;
          lfo.connect(filter.filter.frequency);
          break;
        default:
          lfo.disconnect();
      }
      lfo.updateIntensity();
    };
  });
}

lfoControls.forEach(lfoControl => lfoControl.onchange = updateLFO);

// xmod
var xmodControl = document.querySelector('.xmod');
var xmodGain = audioCtx.createGain();
xmodGain.gain.value = 10;
xmodGain.connect(oscillator2.oscillator.frequency);

xmodControl.onchange = function() {
  console.log('hur');
  if (xmodControl.checked) {
    oscillator1.connect(xmodGain);
  } else {
    oscillator1.disconnect(xmodGain);
  }
}


};

