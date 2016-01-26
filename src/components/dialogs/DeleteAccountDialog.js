import React, { Component, PropTypes } from 'react'

class DeleteAccountDialog extends Component {

  componentWillMount() {
    this.state = {
      scene: 'renderConfirm',
    }
    this.counter = 6
    this.handleJustKidding = ::this.handleJustKidding
    this.handleNotKidding = ::this.handleNotKidding
    this.handleConfirm = ::this.handleConfirm
    this.handleConfirmReally = ::this.handleConfirmReally
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  handleJustKidding() {
    this.props.onRejected()
  }

  handleNotKidding() {
    this.props.onConfirm()
  }

  handleConfirm() {
    this.setState({ scene: 'renderConfirmReally' })
  }

  handleConfirmReally() {
    this.interval = setInterval(() => {
      this.setState({ scene: 'renderCountdown' })
    }, 1000)
  }

  renderConfirm() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>Delete account?</h2>
        <button className="ConfirmDialogButton" onClick={ this.handleConfirm }>Yes</button>
        <button className="ConfirmDialogButton" onClick={ this.handleJustKidding }>No</button>
      </div>
    )
  }

  renderConfirmReally() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>Are you serious?</h2>
        <button className="ConfirmDialogButton" onClick={ this.handleConfirmReally }>Yes</button>
        <button className="ConfirmDialogButton" onClick={ this.handleJustKidding }>No</button>
        <p>
          * By deleting your account you remove your personal information from
          Ello. Your account cannot be restored.
        </p>
      </div>
    )
  }

  renderCountdown() {
    this.counter -= 1
    if (this.counter < 0) {
      this.handleNotKidding()
      return null
    }
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>{`You will be redirected in ${this.counter} ...`}</h2>
        <button
          className="ConfirmDialogButton"
          onClick={ this.handleJustKidding }
          style={{
            display: 'block',
            position: 'absolute',
            width: `${100}%`,
            height: `${40 / 16}rem`,
            borderRadius: `${20 / 16}rem`,
            marginTop: `${40 / 16}rem`,
          }}
        >
          Cancel!
        </button>
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}


DeleteAccountDialog.propTypes = {
  user: PropTypes.shape({}),
  onConfirm: PropTypes.func,
  onRejected: PropTypes.func,
}

export default DeleteAccountDialog

