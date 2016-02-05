import { expect, stub } from '../../spec_helper'
import { parsePost } from '../../../src/components/parsers/PostParser'

describe('PostParser', () => {
  it('#render', () => {
    const post = stub('post', { authorId: '42' })
    const user = stub('user', { id: '42', username: 'forty_two' })
    const cells = parsePost(post, user)

    expect(cells.length).to.equal(2)

    const body = cells[0]

    const textRegion = body.props.children[0]
    expect(textRegion.key).to.equal('TextRegion_0')
    expect(textRegion.props.content).to.contain('Text Region')
    expect(textRegion.props.postDetailPath).to.equal('/forty_two/post/token')

    const footer = cells[1]
    expect(footer.props.author.username).to.equal('forty_two')
    expect(footer.key).to.equal('PostTools_1')
  })
})

