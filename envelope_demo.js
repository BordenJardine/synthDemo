window.onload = function(){

var audioCtx = new window.AudioContext();
var oscElement = document.querySelector('.osc');
var oscillator = new Osc(oscElement, audioCtx);
var ampElement = document.querySelector('.amp');
var amp = new Amp(ampElement, audioCtx);
oscillator.connect(amp.input);
amp.connect(audioCtx.destination);

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => oscillator.freq = frequency);

};

