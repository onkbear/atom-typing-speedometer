'use babel'

describe('AtomTypingSpeedometer', () => {

  let workspaceElement
  let activationPromise

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    jasmine.attachToDOM(workspaceElement)

    waitsForPromise(() => atom.packages.activatePackage('status-bar'))
    activationPromise = atom.packages.activatePackage('atom-typing-speedometer')
    waitsForPromise(() => atom.workspace.open())
  })

  describe('when the atom-typing-speedometer:toggle event is triggered', () => {
    it ('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      expect(workspaceElement.querySelector('.atom-typing-speedometer')).not.toExist()

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-typing-speedometer:toggle')

      waitsForPromise(() => {
        return activationPromise
      })

      runs(() => {
        // Now we can test for view visibility
        let atomTypingSpeedometerElement = workspaceElement.querySelector('.atom-typing-speedometer')
        expect(atomTypingSpeedometerElement).toBeVisible()

        atom.commands.dispatch(workspaceElement, 'atom-typing-speedometer:toggle')
        expect(atomTypingSpeedometerElement).not.toBeVisible()
      })
    })
  })
})
