import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import debounce from 'lodash.debounce'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { saveProfile } from '../../actions/profile'
import BioControl from '../forms/BioControl'
import NameControl from '../forms/NameControl'
import LinksControl from '../forms/LinksControl'

class InfoForm extends Component {

  static propTypes = {
    className: PropTypes.string,
    controlClassModifiers: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object,
    tabIndexStart: PropTypes.number,
  };

  static defaultProps = {
    tabIndexStart: 0,
  };

  componentWillMount() {
    this.state = {
      bioStatus: STATUS.INDETERMINATE,
      linksStatus: STATUS.INDETERMINATE,
      nameStatus: STATUS.INDETERMINATE,
      showThenHideMessage: false,
    }
    this.saveForm = debounce(this.saveForm, 300)
  }

  componentWillReceiveProps() {
    this.setState({
      bioStatus: STATUS.INDETERMINATE,
      linksStatus: STATUS.INDETERMINATE,
      nameStatus: STATUS.INDETERMINATE,
      showThenHideMessage: true,
    })
  }

  saveForm(vo) {
    this.props.dispatch(saveProfile(vo))
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  controlWasChanged(vo, prop) {
    const status = this.state[prop]
    if (status !== STATUS.REQUEST) {
      this.setState({
        [prop]: STATUS.REQUEST,
        showThenHideMessage: false,
      })
    }
    this.saveForm(vo)
  }

  nameControlWasChanged = (vo) => {
    this.controlWasChanged(vo, 'nameStatus')
  };

  bioControlWasChanged = (vo) => {
    this.controlWasChanged(vo, 'bioStatus')
  };

  linksControlWasChanged = (vo) => {
    this.controlWasChanged(vo, 'linksStatus')
  };

  render() {
    const { bioStatus, linksStatus, nameStatus, showThenHideMessage } = this.state
    const { className, controlClassModifiers, profile, tabIndexStart } = this.props
    if (!profile.username) {
      return <div />
    }
    return (
      <form
        className={ classNames(className, 'InfoForm') }
        noValidate="novalidate"
        onSubmit={ this.handleSubmit }
        role="form"
      >
        <NameControl
          classList={ controlClassModifiers }
          onChange={ this.nameControlWasChanged }
          status={ nameStatus }
          tabIndex={ `${tabIndexStart}` }
          text={ profile.name }
        />
        <BioControl
          classList={ controlClassModifiers }
          onChange={ this.bioControlWasChanged }
          status={ bioStatus }
          tabIndex={ `${tabIndexStart + 1}` }
          text={ profile.shortBio }
        />
        <LinksControl
          classList={ controlClassModifiers }
          onChange={ this.linksControlWasChanged }
          status={ linksStatus }
          tabIndex={`${ tabIndexStart + 2 }`}
          text={ profile.externalLinksList }
        />
        <span
          className={ classNames('InfoFormStatus', { showThenHideMessage }) }
        >
          Profile updated successfully
        </span>
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

