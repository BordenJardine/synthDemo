(function() {

const MIN_CUTOFF = 1;
const MAX_CUTOFF = 11025;
const MIN_RES = 0.0001;
const MAX_RES = 25;
const COOLDOWN = 0.01;

class Filter {

  constructor(element, audioCtx) {
    this.audioCtx = audioCtx;
    this.filter = audioCtx.createBiquadFilter();

    // controls
    this.updateFilter = this.updateFilter.bind(this);

    this.cutoffControl = element.querySelector('.cutoffControl');
    this.resonanceControl = element.querySelector('.resonanceControl');
    [this.cutoffControl, this.resonanceControl]
      .forEach(control => control.oninput = this.updateFilter);

    this.updateFilter();
  }

  get input() {
    return this.filter;
  }

  connect(node) {
    this.filter.connect(node);
  }

  updateFilter() {
    // sliders are %s
    var cutoff = this.cutoffControl.value * MAX_CUTOFF / 100;
    var resonance = this.resonanceControl.value * MAX_RES / 100;

    cutoff = Math.max(cutoff, MIN_CUTOFF);
    resonance = Math.max(resonance, MIN_RES);

    console.log(cutoff, resonance);
    var time = this.audioCtx.currentTime + COOLDOWN;

    this.filter.frequency.linearRampToValueAtTime(cutoff, time);
    this.filter.Q.linearRampToValueAtTime(resonance, time);
  }
}

window.Filter = Filter;

})();
