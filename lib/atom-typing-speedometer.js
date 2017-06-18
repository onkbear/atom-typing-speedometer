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

  activate() {
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

  deactivate() {
    this.clearTimer()
    this.subscriptions.dispose()
    this.subscriptionsOfCommand.dispose()
    this.atomTypingSpeedometerView.destroy()
  },

  serialize() {
    return {
      atomTypingSpeedometerViewState: this.atomTypingSpeedometerView.serialize()
    }
  },

  initSubscriptions() {
    // Register changed active text editor event
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((paneItem) => {
      if (paneItem.constructor.name == 'TextEditor' && this.textEditor != paneItem) {
        this.textEditorHandle.dispose()
        this.textEditor = paneItem

        this.subscriptions.add(this.textEditor.onDidChange(() => this.countUp()))
      }
    }))

    // Register changed text editor event
    this.textEditor = atom.workspace.getActiveTextEditor()
    this.textEditorHandle = this.textEditor.onDidChange(() => this.countUp())
    this.subscriptions.add(this.textEditorHandle)

    // Kick
    this.startTimer()
  },

  toggle() {
    // Disable
    if (this.toggled) {
      this.toggled = false

      this.atomTypingSpeedometerView.destroy()
      this.clearTimer()
      this.subscriptions.dispose()
    }
    // Enable
    else {
      this.initSubscriptions()
      this.atomTypingSpeedometerView.initialize(this.statusBar)

      this.toggled = true
    }
  },

  countUp() {
    this.count ++
  },

  startTimer() {
    this.updateCountData()
    this.timer = setTimeout(() => {
      this.startTimer()
    }, timerInterval)
  },

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  updateCountData() {

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

  consumeStatusBar(statusBar) {
    this.statusBar = statusBar
  }

}
