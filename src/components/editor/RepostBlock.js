import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LockIcon } from './EditorIcons'
import { RepostIcon } from '../posts/PostIcons'

function getBlockElement(block, uid) {
  const data = block.data
  switch (block.kind) {
    case 'embed':
      return (
        <img key={`repostEmbed_${uid}`} src={data.thumbnailLargeUrl} alt={data.service} />
      )
    case 'image':
      return (
        <img key={`repostImage_${uid}`} src={data.url} alt={data.alt} />
      )
    case 'text':
      return (
        <div key={`repostText_${uid}`} dangerouslySetInnerHTML={{ __html: data }} />
      )
    default:
      return null
  }
}

class RepostBlock extends Component {

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { currentUser, data } = this.props
    return (
      <div className="editor-block readonly">
        <div className="RepostBlockLabel">
          <RepostIcon />
          {` by @${currentUser.username}`}
        </div>
        {data.map((block, i) => getBlockElement(block, i))}
        <div className="RegionTools">
          <LockIcon />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ profile: currentUser }) {
  return { currentUser }
}

export default connect(mapStateToProps)(RepostBlock)

