import React from 'react'
import { connect } from 'react-redux'
import { saveAvatar } from '../../actions/profile'
import classNames from 'classnames'
import Button from '../buttons/Button'
import Avatar from './Avatar'

class AvatarUploader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      hasDragOver: false,
    }
  }

  triggerFileBrowser() {
    this.refs.AvatarFileBrowser.getDOMNode().click()
  }

  handleFileBrowser(e) {
    const file = e.target.files[0]
    if (file && file.type && !file.type.match(/^image/)) {
      return
    }
    this.props.dispatch(saveAvatar(file))
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file && file.type && !file.type.match(/^image/)) {
      return
    }
    this.setState({ hasDragOver: false })
    this.props.dispatch(saveAvatar(file))
  }

  handleDragOver(e) {
    e.preventDefault()
    this.setState({ hasDragOver: true })
  }

  handleDragLeave(e) {
    e.preventDefault()
    this.setState({ hasDragOver: false })
  }

  render() {
    const { payload } = this.props.profile
    const { avatar } = payload
    const avatarSource = avatar && avatar.tmp ? avatar.tmp : null
    const klassNames = classNames(
      'AvatarUploader',
      { hasDragOver: this.state.hasDragOver },
    )

    return (
      <div className={klassNames}
        onDrop={(e) => this.handleDrop(e)}
        onDragOver={(e) => this.handleDragOver(e)}
        onDragLeave={(e) => this.handleDragLeave(e)}
        >
        <Avatar imgSrc={avatarSource} />
        <Button
          onClick={(e) => this.triggerFileBrowser(e)}>
          Pick an Avatar
        </Button>
        <p>Or drag & drop</p>
        <p>Recommended image size: 360 x 360</p>
        <input
          className="hidden"
          onChange={(e) => this.handleFileBrowser(e)}
          ref="AvatarFileBrowser"
          type="file"
          capture="camera"
          accept="image/*" />
      </div>
    )
  }
}

AvatarUploader.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  profile: React.PropTypes.shape({
    payload: React.PropTypes.shape,
  }),
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(AvatarUploader)

