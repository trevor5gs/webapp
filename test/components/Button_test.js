import { expect, getRenderedComponent } from '../spec_helper'
import { default as subject } from '../../src/components/buttons/Button'

describe('Button#render', () => {
  it('renders correctly', () => {
    const button = getRenderedComponent(subject, {className: 'MyButton'}, 'Yo')
    expect(button.type).to.equal('button')
    expect(button.props.className).to.equal('MyButton Button')
    expect(button.props.classListName).to.equal('Button')
    expect(button.props.children).to.equal('Yo')
  })
})

