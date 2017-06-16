'use babel'

import AtomTypingSpeedometerView from './atom-typing-speedometer-view'
import { CompositeDisposable } from 'atom'

export default {

  atomTypingSpeedometerView: null,
  subscriptions: null,

  activate() {
    this.atomTypingSpeedometerView = new AtomTypingSpeedometerView()

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-typing-speedometer:toggle': () => this.toggle()
    }))
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
  }

}
