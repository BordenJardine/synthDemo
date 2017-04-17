window.onload = function(){

var audioCtx = new window.AudioContext();

var oscElement = document.querySelector('.osc');
var oscillator = new Osc(oscElement, audioCtx);

var filterElement = document.querySelector('.filter');
var filter = new Filter(filterElement, audioCtx);

var ampElement = document.querySelector('.amp');
var amp = new Amp(ampElement, audioCtx);

var scopeElement = document.querySelector('.bigScope');
var scope = new Scope(scopeElement, audioCtx);

oscillator.connect(amp.input);
amp.connect(filter.input);
filter.connect(scope.input);
scope.connect(audioCtx.destination);

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => {
  oscillator.freq = frequency;
  amp.trigger(frequency);
});

midiHandler.onnoteoff = (frequency => {
  amp.releaseNote(frequency);
});

};
