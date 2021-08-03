window.onload = function() {
document.querySelector('#start').onclick = function() {
var audioCtx = new window.AudioContext();
var oscElement = document.querySelector('.osc');
var oscillator = new Osc(oscElement, audioCtx);
oscillator.connect(audioCtx.destination);

var midiHandler = new MidiHandler();
midiHandler.onnoteon = (frequency => oscillator.freq = frequency);
}
}
