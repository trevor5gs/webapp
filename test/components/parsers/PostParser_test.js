import { expect, json, stub } from '../../spec_helper'
import { parsePost } from '../../../src/components/parsers/PostParser'

describe('PostParser', () => {
  it('#render', () => {
    const post = stub('post', { authorId: '42' })
    stub('user', { id: '42', username: 'forty_two' })
    const cells = parsePost(post, json)

    expect(cells.length).to.equal(3)

    const header = cells[0]
    expect(header.props.className).to.equal('PostHeader')
    expect(header.key).to.equal('PostHeader_1')

    const body = cells[1]

    const textRegion = body.props.children[0]
    expect(textRegion.key).to.equal('TextRegion_0')
    expect(textRegion.props.content).to.contain('Text Region')
    expect(textRegion.props.postDetailPath).to.equal('/forty_two/post/token')

    const footer = cells[2]
    expect(footer.props.author.username).to.equal('forty_two')
    expect(footer.key).to.equal('PostTools_1')
  })
})

