'use babel'

import AtomTypingSpeedometerView from './atom-typing-speedometer-view'
import { CompositeDisposable } from 'atom'

export default {

  atomTypingSpeedometerView: null,
  subscriptions: null,
  textEditor: null,
  textEditorHandle: null,
  count: 0,

  activate() {
    this.atomTypingSpeedometerView = new AtomTypingSpeedometerView()

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-typing-speedometer:toggle': () => this.toggle()
    }))

    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((paneItem) => {
      if (paneItem.constructor.name == 'TextEditor' && this.textEditor != paneItem) {
        console.log('changed!!')

        this.textEditorHandle.dispose()
        this.textEditor = paneItem

        this.subscriptions.add(this.textEditor.onDidChange(() => this.countUp()))
      }
    }))

    this.textEditor = atom.workspace.getActiveTextEditor()
    this.textEditorHandle = this.textEditor.onDidChange(() => this.countUp())
    this.subscriptions.add(this.textEditorHandle)
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

    data = {
      'cps': this.count,
      'cpm': this.count
    }
    this.atomTypingSpeedometerView.setData(data)
    this.atomTypingSpeedometerView.drawElement()
  },

  consumeStatusBar(statusBar) {
    this.atomTypingSpeedometerView.initialize(statusBar)
  }

}
