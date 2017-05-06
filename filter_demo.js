window.onload = function(){

var audioCtx = new window.AudioContext();

var oscElement = document.querySelector('.osc');
var oscillator = new Osc(oscElement, audioCtx);

var filterElement = document.querySelector('.filter');
var filter = new Filter(filterElement, audioCtx);

var ampElement = document.querySelector('.amp');
var amp = new Amp(ampElement, audioCtx);

var scopeElement = document.querySelector('.scopeModule');
var doubleScope = new DoubleScope(scopeElement, audioCtx);

oscillator.connect(amp.input);
amp.connect(filter.input);
doubleScope.monitor(filter.input);

filter.connect(audioCtx.destination);

var envelopes = [amp.envelope, filter.envelope];

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => {
  oscillator.freq = frequency;
  envelopes.forEach(envelope => envelope.trigger(frequency));
});

midiHandler.onnoteoff = (frequency => {
  envelopes.forEach(envelope => envelope.releaseNote(frequency));
});

};

