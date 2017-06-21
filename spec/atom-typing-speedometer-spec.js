'use babel'

describe('AtomTypingSpeedometer', () => {
  let workspaceElement
  let originalConfig

  beforeEach(() => {
    originalConfig = atom.config.get('atom-typing-speedometer')
    atom.config.set('atom-typing-speedometer.autoToggle', true)

    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() => atom.workspace.open())
    waitsForPromise(() => atom.packages.activatePackage('status-bar'))
    waitsForPromise(() => atom.packages.activatePackage('atom-typing-speedometer'))
  })

  afterEach(() => {
    atom.config.set('atom-typing-speedometer', originalConfig)
  })

  describe('when the atom-typing-speedometer:toggle event is triggered', () => {
    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.
      expect(workspaceElement.querySelector('.atom-typing-speedometer')).toExist()

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-typing-speedometer:toggle')

      runs(() => {
        // Now we can test for view visibility
        let atomTypingSpeedometerElement = workspaceElement.querySelector('.atom-typing-speedometer')
        expect(atomTypingSpeedometerElement).not.toBeVisible()

        atom.commands.dispatch(workspaceElement, 'atom-typing-speedometer:toggle')
        expect(atomTypingSpeedometerElement).not.toBeVisible()
      })
    })
  })
})
