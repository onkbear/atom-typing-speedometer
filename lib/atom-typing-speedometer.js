'use babel'

import AtomTypingSpeedometerView from './atom-typing-speedometer-view'
import { CompositeDisposable } from 'atom'

const timerInterval = 1000
const secondsPerMinute = 60

export default {

  atomTypingSpeedometerView: null,
  subscriptions: null,
  textEditor: null,
  textEditorHandle: null,
  count: 0,
  countHistory: [],

  activate() {
    this.atomTypingSpeedometerView = new AtomTypingSpeedometerView()

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-typing-speedometer:toggle': () => this.toggle()
    }))

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

  deactivate() {
    this.subscriptions.dispose()
    this.atomTypingSpeedometerView.destroy()
  },

  serialize() {
    return {
      atomTypingSpeedometerViewState: this.atomTypingSpeedometerView.serialize()
    }
  },

  toggle() {
    console.log('AtomTypingSpeedometer was toggled!')
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

  updateCountData() {

    // Store count history up to 60s
    this.countHistory.push(this.count)
    if (secondsPerMinute < this.countHistory.length) {
      this.countHistory.shift()
    }

    // Reset counter
    this.count = 0

    // Update and Draw
    this.atomTypingSpeedometerView.setData(this.countHistory)
    this.atomTypingSpeedometerView.drawElement()
  },

  consumeStatusBar(statusBar) {
    this.atomTypingSpeedometerView.initialize(statusBar)
  }

}
