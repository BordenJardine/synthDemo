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
    this.envelope = new Envelope(element, audioCtx, this.filter.frequency);

    // controls
    this.updateFilter = this.updateFilter.bind(this);
    this.cutoffControl = element.querySelector('.cutoffControl');
    this.resonanceControl = element.querySelector('.resonanceControl');
    [this.cutoffControl, this.resonanceControl]
      .forEach(control => control.oninput = this.updateFilter);

    this.updateFilterType = this.updateFilterType.bind(this);
    this.filterTypeControls = element.querySelectorAll('.filterTypeControl');
    this.filterTypeControls.forEach(filterTypeControl => {
      filterTypeControl.onchange = this.updateFilterType;
    });
  
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

    // adjustig the cutoff slider both sets the current frequency
    //   and sets the max the envelope will take it to
    cutoff = Math.max(cutoff, MIN_CUTOFF);
    this.envelope.maxValue = cutoff;

    var time = this.audioCtx.currentTime + COOLDOWN;
    this.filter.frequency.cancelScheduledValues(this.audioCtx.currentTime);
    this.filter.frequency.linearRampToValueAtTime(cutoff, time);

    resonance = Math.max(resonance, MIN_RES);
    this.filter.Q.cancelScheduledValues(this.audioCtx.currentTime);
    this.filter.Q.linearRampToValueAtTime(resonance, time);
  }

  updateFilterType() {
    this.filterTypeControls.forEach(filterTypeControl => {
      if (filterTypeControl.checked) {
        this.filter.type = filterTypeControl.value;
      };
    });
  };
}

window.Filter = Filter;

})();
