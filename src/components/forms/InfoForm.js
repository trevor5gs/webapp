import React from 'react'
import { connect } from 'react-redux'
import { saveProfile } from '../../actions/profile'
import NameControl from './NameControl'
import BioControl from './BioControl'
import LinksControl from './LinksControl'
import { debounce } from '../base/lib'

class InfoForm extends React.Component {

  componentWillMount() {
    this.saveForm = debounce(this.saveForm, 500)
  }

  saveForm(vo) {
    this.props.dispatch(saveProfile(vo))
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  handleControlChange(vo) {
    this.saveForm(vo)
  }

  render() {
    const { payload } = this.props.profile
    const { name, externalLinksList, shortBio } = payload
    const externalLinks = externalLinksList ? externalLinksList.map((link) => { return link.text }) : ''

    return (
      <form className="InfoForm" onSubmit={this.handleSubmit} role="form" noValidate="novalidate">
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

InfoForm.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  profile: React.PropTypes.shape({
    payload: React.PropTypes.shape,
  }),
}

export default connect(mapStateToProps)(InfoForm)

