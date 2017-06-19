'use babel'

export default class AtomTypingSpeedometerView {

  constructor() {
    this.element = null
    this.textElement = null
    this.spectrumElement = null
    this.data = null
    this.speedometerTile = null
    this.visibility = false
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
    if (this.speedometerTile) {
      this.speedometerTile.destroy()
    }
  }

  initializeElement() {
    this.element = document.createElement('atom-typing-speedometer')
    this.element.className = 'atom-typing-speedometer inline-block'
    this._reflectVisibility()

    // Append spectrum element
    this.spectrumElement = document.createElement('span')
    this.spectrumElement.className = 'spectrum'

    for (let i = 0; i < 60; ++i) {
      let element = document.createElement('span')
      element.className = 'index'
      let childElement = document.createElement('span')
      childElement.className = 'count'
      childElement.style = 'height: 1%;'
      element.appendChild(childElement)
      this.spectrumElement.appendChild(element)
    }

    this.element.appendChild(this.spectrumElement)

    // Append text element
    this.textElement = document.createElement('span')
    this.element.appendChild(this.textElement)

    this.speedometerTile = this.statusBar.addLeftTile({
      item: this.element,
      priority: 1
    })
  }

  drawElement() {
    if (this.element && this.visibility) {

      let countsPerMinute = 0
      let countsPerSecond = 0

      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]'
        }
      }

      // Calc max value for calc percentage.
      // Prevent 100% from 0 count.
      let maxValue = Math.max.apply(null, this.data)
      if (maxValue < 1) {
        maxValue = 1
      }

      if (Array.isArray(this.data)) {
        // Calc count per minute.
        for (let prop in this.data) {
          countsPerMinute += this.data[prop]
        }
        if (atom.config.get('atom-typing-speedometer.showSpectrum')) {
          let index = 0
          for (let prop in this.data) {
            if (index < this.spectrumElement.children.length) {
              // Calc percentage.
              let percentage = this.data[prop] / maxValue * 100
              this.spectrumElement.children[index].firstChild.style = 'height: ' + percentage + '%;'
            }
            index ++
          }
        }
        countsPerSecond = this.data[this.data.length - 1]
      }

      // Update spectrum visibility
      if (atom.config.get('atom-typing-speedometer.showSpectrum')) {
        this.spectrumElement.style.display = ''
      }
      else {
        this.spectrumElement.style.display = 'none'
      }

      // Update element
      this.textElement.textContent = ''
      if (atom.config.get('atom-typing-speedometer.showMinute')) {
        this.textElement.textContent += countsPerMinute + '/m '
      }
      if (atom.config.get('atom-typing-speedometer.showSecondAvg')) {
        let countsPerSecondAvg = countsPerMinute / 60
        this.textElement.textContent += 'avg ' + countsPerSecondAvg.toFixed(2) + '/s '
      }
      if (atom.config.get('atom-typing-speedometer.showSecond')) {
        this.textElement.textContent += countsPerSecond + '/s '
      }
    }
  }

  setData(data) {
    this.data = data
  }

  setVisible(visibility) {
    this.visibility = visibility
    this._reflectVisibility()
  }

  _reflectVisibility() {
    if (this.element) {
      this.element.style.display = (this.visibility) ? '' : 'none'
    }
  }

}
