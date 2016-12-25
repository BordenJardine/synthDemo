window.onload = function(){

var audioCtx = new window.AudioContext();
var oscElement = document.querySelector('.osc');
var oscillator = new Osc(oscElement, audioCtx);
oscillator.connect(audioCtx.destination);

};

