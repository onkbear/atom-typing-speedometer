'use babel'

import AtomTypingSpeedometerView from './atom-typing-speedometer-view'
import { CompositeDisposable } from 'atom'

const timerInterval = 1000
const secondsPerMinute = 60

export default {

  atomTypingSpeedometerView: null,
  subscriptionsOfCommand: null,
  subscriptions: null,
  textEditor: null,
  textEditorHandle: null,
  count: 0,
  countHistory: [],
  toggled: false,
  statusBar: null,

  config: {
    autoToggle: {
      type: 'boolean',
      title: 'Auto toggle',
      default: true,
      order: 1
    },
    showSecond: {
      type: 'boolean',
      title: 'Show counts per second',
      default: true,
      order: 2
    },
    showSecondAvg: {
      type: 'boolean',
      title: 'Show counts per second (Average per minute)',
      default: false,
      order: 3
    },
    showMinute: {
      type: 'boolean',
      title: 'Show counts per minute',
      default: true,
      order: 4
    },
    showSpectrum: {
      type: 'boolean',
      title: 'Show spectrum',
      default: true,
      order: 5
    }
  },

  activate () {
    this.atomTypingSpeedometerView = new AtomTypingSpeedometerView()

    // Register command that toggles this view
    this.subscriptionsOfCommand = atom.commands.add('atom-workspace', {
      'atom-typing-speedometer:toggle': () => this.toggle()
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Initialize array
    while (this.countHistory.length < secondsPerMinute) {
      this.countHistory.push(0)
    }
  },

  deactivate () {
    this.clearTimer()
    this.subscriptions.dispose()
    this.subscriptionsOfCommand.dispose()
    this.atomTypingSpeedometerView.destroy()
  },

  serialize () {
    return {
      atomTypingSpeedometerViewState: this.atomTypingSpeedometerView.serialize()
    }
  },

  initSubscriptions () {
    // Register changed active text editor event
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((paneItem) => {
      if (paneItem) {
        let isTextEditor = (paneItem.constructor.name === 'TextEditor')
        if (this.textEditor !== paneItem && isTextEditor) {
          if (this.textEditorHandle) {
            this.textEditorHandle.dispose()
          }
          this.textEditor = paneItem

          this.subscriptions.add(this.textEditor.onDidChange(() => this.countUp()))
        }

        // Set visibility
        this.atomTypingSpeedometerView.setVisible(isTextEditor)
      }
    }))

    // Register changed text editor event
    this.textEditor = atom.workspace.getActiveTextEditor()
    if (this.textEditor) {
      this.textEditorHandle = this.textEditor.onDidChange(() => this.countUp())
      this.subscriptions.add(this.textEditorHandle)
      this.atomTypingSpeedometerView.setVisible(true)
    }

    // Kick
    this.startTimer()
  },

  toggle () {
    if (this.toggled) {
      // Disable
      this.toggled = false

      this.atomTypingSpeedometerView.destroy()
      this.clearTimer()
      this.subscriptions.dispose()
    } else {
      // Enable
      this.initSubscriptions()
      this.atomTypingSpeedometerView.initialize(this.statusBar)

      this.toggled = true
    }
  },

  countUp () {
    this.count++
  },

  startTimer () {
    this.updateCountData()
    this.timer = setTimeout(() => {
      this.startTimer()
    }, timerInterval)
  },

  clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  updateCountData () {
    // Store count history up to 60s
    this.countHistory.push(this.count)
    while (secondsPerMinute < this.countHistory.length) {
      this.countHistory.shift()
    }

    // Reset counter
    this.count = 0

    // Update and Draw
    this.atomTypingSpeedometerView.setData(this.countHistory)
    this.atomTypingSpeedometerView.drawElement()
  },

  consumeStatusBar (statusBar) {
    this.statusBar = statusBar

    // Auto toggle
    if (atom.config.get('atom-typing-speedometer.autoToggle')) {
      this.toggle()
    }
  }

}
