import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/gui_types'
import { loadInvitedUsers } from '../../actions/invitations'
import { inviteUsers } from '../../actions/invitations'
import StreamComponent from '../../components/streams/StreamComponent'
import BatchEmailControl from '../../components/forms/BatchEmailControl'
import { getBatchEmailState } from '../../components/forms/Validators'
import FormButton from '../../components/forms/FormButton'

class Invitations extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static preRender = (store) =>
    store.dispatch(loadInvitedUsers())

  componentWillMount() {
    this.state = {
      formStatus: STATUS.INDETERMINATE,
      batchEmailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.batchEmailValue = []
  }

  onChangeControl = ({ emails }) => {
    this.batchEmailValue = emails.split(/[,\s]+/)
    const { batchEmailState } = this.state
    const currentStatus = batchEmailState.status
    const newState = getBatchEmailState({ value: emails, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ batchEmailState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { batchEmailState } = this.state
    if (batchEmailState.status !== STATUS.SUCCESS) {
      return this.setState({ formStatus: STATUS.FAILURE })
    }
    const { dispatch } = this.props
    dispatch(inviteUsers(this.batchEmailValue))
    this.setState({ formStatus: STATUS.SUBMITTED })
    return null
  }

  renderMessage() {
    const { formStatus } = this.state
    switch (formStatus) {
      case STATUS.SUBMITTED:
        return 'Your invitations have been sent.'
      case STATUS.FAILURE:
        return 'There was an error submitting that form. Please contact support.'
      case STATUS.SUCCESS:
      case STATUS.INDETERMINATE:
      default:
        return (
          'You can invite multiple friends at once, just separate their email adresses with commas.'
        )
    }
  }

  render() {
    const { batchEmailState } = this.state
    const isValid = batchEmailState.status === STATUS.SUCCESS
    return (
      <section className="Invitations Panel">
        <header className="InvitationsHeader">
          <h1 className="InvitationsHeading">Invite your friends</h1>
          <p>
            Help Ello grow organically by inviting the people you love, and who
            you know will love Ello too.
          </p>
        </header>
        <div className="InvitationsForm">

          <form
            className="InvitationForm"
            noValidate="novalidate"
            onSubmit={ this.onSubmit }
            role="form"
          >
            <BatchEmailControl
              classList="asBoxControl onWhite"
              label={ `Emails ${batchEmailState.message}` }
              onChange={ this.onChangeControl }
              tabIndex="1"
            />
            <FormButton
              className="FormButton asPill"
              disabled={ !isValid }
              tabIndex="2"
            >
              Invite
            </FormButton>
            <p className="BatchEmailControlSuggestions" style={{ color: '#aaa' }}>
              { this.renderMessage() }
            </p>
          </form>

        </div>
        <h2 className="InvitationsStreamHeading">Friends you've invited</h2>
        <StreamComponent action={loadInvitedUsers()} />
      </section>
    )
  }
}

export default connect()(Invitations)

