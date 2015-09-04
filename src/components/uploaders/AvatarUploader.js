import React from 'react'
import { connect } from 'react-redux'
import { saveAvatar } from '../../actions/profile'
import Button from '../buttons/Button'

class AvatarUploader extends React.Component {

  triggerFileBrowser() {
    this.refs.AvatarFileBrowser.getDOMNode().click()
  }

  handleFileBrowser(e) {
    const file = e.target.files[0]
    if (!file.type.match(/^image/)) {
      return
    }
    this.props.dispatch(saveAvatar(file))
  }


  renderAvatar(src) {
    if (src) {
      const style = {
        backgroundImage: `url(${src})`,
        backgroundColor: 'white',
      }
      return <figure className="Avatar" style={style}></figure>
    }
    return <figure className="Avatar"></figure>
  }


  render() {
    const { payload } = this.props.profile
    const { avatar } = payload
    const avatarSource = avatar && avatar.tmp ? avatar.tmp : null

    return (
      <div className="AvatarUploader">
        { this.renderAvatar(avatarSource) }
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

