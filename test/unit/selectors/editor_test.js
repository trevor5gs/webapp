import { selectCompletions } from '../../../src/selectors/editor'

describe('editor selectors', () => {
  context('#selectCompletions', () => {
    it('returns the editor.completions', () => {
      const state = { editor: { completions: 'editor.completions' } }
      expect(selectCompletions(state)).to.equal('editor.completions')
    })
  })
})

