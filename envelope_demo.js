window.onload = function(){
document.querySelector('#start').onclick = function() {

var audioCtx = new window.AudioContext();

var oscElement = document.querySelector('.osc');
var oscillator = new Osc(oscElement, audioCtx);

var ampElement = document.querySelector('.amp');
var amp = new Amp(ampElement, audioCtx);

var scopeElement = document.querySelector('.bigScope');
var scope = new Scope(scopeElement, audioCtx);

oscillator.connect(amp.input);
amp.connect(scope.input);
scope.connect(audioCtx.destination);

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => {
  oscillator.freq = frequency;
  amp.envelope.trigger(frequency);
});

midiHandler.onnoteoff = (frequency => {
  amp.envelope.releaseNote(frequency);
});

};
};

