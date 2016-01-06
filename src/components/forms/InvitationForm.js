import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
// import { saveProfile } from '../../actions/profile'
import BatchEmailControl from '../forms/BatchEmailControl'
import FormButton from '../forms/FormButton'

class InvitationForm extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      batchEmailStatus: STATUS.INDETERMINATE,
    }
  }

  handleControlChange(vo) {
    const { batchEmailStatus } = this.state
    if (!vo.emails.length && batchEmailStatus !== STATUS.INDETERMINATE) {
      return this.setState({ batchEmailStatus: STATUS.INDETERMINATE })
    }
    if (batchEmailStatus !== STATUS.SUCCESS) {
      return this.setState({ batchEmailStatus: STATUS.SUCCESS })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  render() {
    const { className } = this.props
    const { batchEmailStatus } = this.state
    const isFormValid = batchEmailStatus === STATUS.SUCCESS
    return (
      <form
        className={classNames(className, 'InvitationForm')}
        noValidate="novalidate"
        onSubmit={this.handleSubmit}
        role="form"
      >
        <BatchEmailControl
          classModifiers="asBoxControl onWhite"
          controlWasChanged={::this.handleControlChange}
          status={batchEmailStatus}
          tabIndex="1"
        />
        <FormButton tabIndex="2" disabled={!isFormValid}>Invite</FormButton>
        <p className="BatchEmailControlSuggestions" style={{ color: '#aaa' }}>
          You can invite multiple friends at once, just separate their email adresses with commas.
        </p>
      </form>
    )
  }
}

export default connect()(InvitationForm)

