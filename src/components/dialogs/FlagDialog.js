import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

const flags = {
  spam: 'Spam',
  violence: 'Violence',
  copyright: 'Copyright infringement',
  threatening: 'Threatening',
  hate_speech: 'Hate Speech',
  adult: 'Adult content that isn\'t marked NSFW*',
  offensive: 'I don\'t like it',
}

const _offsets = { mobile: 70, tablet: 80, desktop: 100 }

class FlagDialog extends Component {

  static propTypes = {
    onResponse: PropTypes.func,
    onConfirm: PropTypes.func,
    viewportDeviceSize: PropTypes.string,
  }

  componentWillMount() {
    this.state = {
      activeChoice: null,
      scene: 'renderChoicesScreen',
    }
  }

  onClickChoiceWasMade = () => {
    const { onResponse } = this.props
    const { activeChoice } = this.state
    this.setState({ scene: 'renderConfirmationScreen' })
    onResponse({ flag: activeChoice })
  }

  onClickChoice = (e) => {
    const { activeChoice } = this.state
    const dataFlag = e.target.dataset.flag
    const newChoice = dataFlag === activeChoice ? null : dataFlag
    this.setState(
      { activeChoice: newChoice },
    )
  }

  renderFlagChoices() {
    const { activeChoice } = this.state
    const buttons = []
    for (const choice of Object.keys(flags)) {
      buttons.push(
        <button
          className={ classNames({ isActive: activeChoice === choice }, 'FlagDialogChoice') }
          data-flag={ choice }
          key={ choice }
          onClick={ this.onClickChoice }
        >
          { flags[choice] }
        </button>
      )
    }
    return buttons
  }

  renderChoicesScreen() {
    const { activeChoice } = this.state
    const index = Object.keys(flags).indexOf(activeChoice)
    const top = index < 0 ? null : (70 * index) + _offsets[this.props.viewportDeviceSize]
    return (
      <div className="Dialog FlagDialog">
        <h2>Would you like to flag this content as:</h2>
        <div className="FlagDialogBody">
          { this.renderFlagChoices() }

          <button
            className="FlagDialogButton"
            onClick={ this.onClickChoiceWasMade }
            style={ top ? { top, display: 'inline-block' } : { display: 'none' } }
          >
            Submit
          </button>

        </div>
        <p className="FlagDialogFootnote">
          Ello allows adult content as long as it complies with our rules and is
          marked NSFW. You may temporarily still see this content. You may want
          to block or mute this user as well.
        </p>
      </div>
    )
  }

  renderConfirmationScreen() {
    const { onConfirm } = this.props
    return (
      <div className="Dialog FlagDialog">
        <h2>Thank you.</h2>
        <p>
          You may temporarily still see this content. You may want to block or
          mute this user as well.
        </p>
        <div className="FlagDialogBody">
          <button className="FlagDialogOkayButton" onClick={ onConfirm }>Okay</button>
        </div>
      </div>
    )
  }

  render() {
    const { scene } = this.state
    return this[scene]()
  }
}

export default FlagDialog

