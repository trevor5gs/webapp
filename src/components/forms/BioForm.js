import React from 'react'
import { connect } from 'react-redux'
import { saveProfile } from '../../actions/profile'
import NameControl from './NameControl'
import BioControl from './BioControl'
import LinksControl from './LinksControl'

class BioForm extends React.Component {

  handleSubmit(e) {
    e.preventDefault()
  }

  handleControlChange(vo) {
    this.props.dispatch(saveProfile(vo))
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
    const { name, externalLinks, shortBio, avatar } = payload
    const avatarSource = avatar && avatar.tmp ? avatar.tmp : null

    return (
      <form className="BioForm" onSubmit={this.handleSubmit} role="form" noValidate="novalidate">
        { this.renderAvatar(avatarSource) }
        <NameControl tabIndex="1" text={name} controlWasChanged={this.handleControlChange.bind(this)} />
        <BioControl tabIndex="2" text={shortBio} controlWasChanged={this.handleControlChange.bind(this)} />
        <LinksControl tabIndex="3" text={externalLinks} controlWasChanged={this.handleControlChange.bind(this)} />
      </form>
    )
  }

}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

BioForm.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  profile: React.PropTypes.shape({
    payload: React.PropTypes.shape,
  }),
}

export default connect(mapStateToProps)(BioForm)

