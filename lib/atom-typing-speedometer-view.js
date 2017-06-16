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

      let countsPerMinute = 0
      let countsPerSecond = 0

      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]'
        }
      }
      if (Array.isArray(this.data)) {
        this.data.forEach(function(value) {
          countsPerMinute += value
        })
        countsPerSecond = this.data[this.data.length - 1]
      }

      this.element.firstChild.textContent = countsPerMinute + '/m ' + countsPerSecond + '/s'
    }
  }

  setData(data) {
    this.data = data
  }

}
