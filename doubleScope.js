(function() {

class DoubleScope {
  constructor(element, audioCtx) {
    this.scopeElement = element.querySelector('.scope');
    this.freqElement = element.querySelector('.freqGraph');
    this.scope = new Scope(this.scopeElement, audioCtx);
    this.graph = new FrequencyGraph(this.freqElement, audioCtx);
    this.shown = this.scope;

    this.controls = element.querySelectorAll('.scopeTypeControl');
    this.controls.forEach(control => control.onclick = this.toggle.bind(this));
  }

  monitor(node) {
    this.input = node;
    this.input.connect(this.shown.input);
  }

  toggle() {
    console.log('toggle!');
    if (this.shown == this.scope) {
      this.freqElement.classList.add('hidden');
      this.scopeElement.classList.remove('hidden');
      this.input.disconnect(this.graph.input);
      this.input.connect(this.scope.input);
      this.scope.enable();
      this.graph.disable();
      this.shown = this.graph;
    } else {
      this.scopeElement.classList.add('hidden');
      this.freqElement.classList.remove('hidden');
      this.input.disconnect(this.scope.input);
      this.input.connect(this.graph.input);
      this.graph.enable();
      this.scope.disable();
      this.shown = this.scope;
    }
  }
}

window.DoubleScope = DoubleScope;

})();
