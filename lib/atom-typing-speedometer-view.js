'use babel'

export default class AtomTypingSpeedometerView {

  constructor() {
    this.element = null
    this.data = {
      'cps': 0,
      'cpm': 0
    }
  }

  initialize(statusBar) {
    this.statusBar = statusBar
    this.initializeElement()

    // First draw
    this.drawElement()
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
  }

  initializeElement() {
    this.element = document.createElement('atom-typing-speedometer')
    this.element.className = 'atom-typing-speedometer inline-block'
    this.element.appendChild(document.createElement('span'))

    this.statusBar.addLeftTile({
      item: this.element,
      priority: 1
    })
  }

  drawElement() {
    if (this.element) {
      this.element.firstChild.textContent = this.data.cpm + '/m' + this.data.cps + '/s '
    }
  }

  setData(data) {
    this.data = data
  }

}
