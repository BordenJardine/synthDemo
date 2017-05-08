(function() {

class DoubleScope {
  constructor(element, audioCtx) {
    this.scopeElement = element.querySelector('.scope');
    this.graphElement = element.querySelector('.freqGraph');
    this.scope = new Scope(this.scopeElement, audioCtx);
    this.graph = new FrequencyGraph(this.graphElement, audioCtx);
    this.shown = this.scope;

    this.controls = element.querySelectorAll('.scopeTypeControl');
    this.controls.forEach(control => control.onclick = this.toggle.bind(this));
  }

  monitor(node) {
    this.input = node;
    this.input.connect(this.shown.input);
  }

  toggle() {
    if (this.shown == this.scope) {
      this.input.disconnect(this.scope.input);
      this.input.connect(this.graph.input);
      this.graph.enable();
      this.scope.disable();
      this.scopeElement.classList.add('hidden');
      this.graphElement.classList.remove('hidden');
      this.shown = this.graph;
    } else {
      this.input.disconnect(this.graph.input);
      this.input.connect(this.scope.input);
      this.scope.enable();
      this.graph.disable();
      this.graphElement.classList.add('hidden');
      this.scopeElement.classList.remove('hidden');
      this.shown = this.scope;
    }
  }
}

window.DoubleScope = DoubleScope;

})();
