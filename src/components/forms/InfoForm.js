import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { saveProfile } from '../../actions/profile'
import BioControl from '../forms/BioControl'
import NameControl from '../forms/NameControl'
import LinksControl from '../forms/LinksControl'

class InfoForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object,
  }

  componentWillMount() {
    this.saveForm = debounce(this.saveForm, 300)
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
    const { name, externalLinksList, shortBio, username } = payload
    const externalLinks = externalLinksList ? externalLinksList.map((link) => { return link.text }) : ''

    if (!username) {
      return <div />
    }
    return (
      <form className="InfoForm" onSubmit={this.handleSubmit} role="form" noValidate="novalidate">
        <NameControl tabIndex="1" text={name} controlWasChanged={::this.handleControlChange} />
        <BioControl tabIndex="2" text={shortBio} controlWasChanged={::this.handleControlChange} />
        <LinksControl tabIndex="3" text={externalLinks} controlWasChanged={::this.handleControlChange} />
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(InfoForm)

