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
    this.element = document.createElement('div')
    this.element.className = 'atom-typing-speedometer'
    this.element.appendChild(document.createElement('span'))

    this.statusBar.addRightTile({
      item: this.element,
      priority: -1
    })
  }

  drawElement() {
    if (this.element) {
      this.element.firstChild.textContent = this.data.cps + '/s ' + this.data.cpm + '/m'
    }
  }

  setData(data) {
    this.data = data
  }

}
