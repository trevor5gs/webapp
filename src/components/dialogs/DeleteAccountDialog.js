import React, { Component, PropTypes } from 'react'

class DeleteAccountDialog extends Component {

  static propTypes = {
    user: PropTypes.shape({}),
    onConfirm: PropTypes.func,
    onDismiss: PropTypes.func,
  }

  componentWillMount() {
    this.state = {
      scene: 'renderConfirm',
    }
    this.counter = 6
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onClickJustKidding = () => {
    this.props.onDismiss()
  }

  onClickNotKidding = () => {
    this.props.onConfirm()
  }

  onClickConfirm = () => {
    this.setState({ scene: 'renderConfirmReally' })
  }

  onClickConfirmReally = () => {
    this.interval = setInterval(() => {
      this.setState({ scene: 'renderCountdown' })
    }, 1000)
  }

  renderConfirm() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>Delete account?</h2>
        <button className="ConfirmDialogButton" onClick={ this.onClickConfirm }>Yes</button>
        <button className="ConfirmDialogButton" onClick={ this.onClickJustKidding }>No</button>
      </div>
    )
  }

  renderConfirmReally() {
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>Are you sure?</h2>
        <button className="ConfirmDialogButton" onClick={ this.onClickConfirmReally }>Yes</button>
        <button className="ConfirmDialogButton" onClick={ this.onClickJustKidding }>No</button>
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
      this.onClickNotKidding()
      return null
    }
    return (
      <div className="Dialog DeleteAccountDialog">
        <h2>{`You will be redirected in ${this.counter} ...`}</h2>
        <button
          className="ConfirmDialogButton"
          onClick={ this.onClickJustKidding }
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

export default DeleteAccountDialog

