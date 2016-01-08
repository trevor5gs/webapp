import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

const flags = [
  'spam',
  'violence',
  'copyright',
  'threatening',
  'hate_speech',
  'adult',
  'offensive',
]

const labels = [
  'Spam',
  'Violence',
  'Copyright infringement',
  'Threatening',
  'Hate Speech',
  'Adult content that isn\'t marked NSFW*',
  'I don\'t like it',
]

class FlagDialog extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      activeChoice: null,
      scene: 'renderChoicesScreen',
    }
  }

  choiceWasMade() {
    const { onResponse } = this.props
    const { activeChoice } = this.state
    this.setState({ scene: 'renderConfirmationScreen' })
    onResponse({ flag: activeChoice })
  }

  handleChoiceClick(e) {
    const { activeChoice } = this.state
    const dataFlag = e.target.dataset.flag
    const newChoice = dataFlag === activeChoice ? null : dataFlag
    this.setState(
      { activeChoice: newChoice },
    )
  }

  renderFlagChoices() {
    const { activeChoice } = this.state
    return flags.map((choice, index) => {
      return (
        <button
          className={ classNames({ isActive: activeChoice === choice }, 'FlagDialogChoice') }
          data-flag={ choice }
          key={ index }
          onClick={ ::this.handleChoiceClick }
        >
          { labels[index] }
        </button>
      )
    })
  }

  renderChoicesScreen() {
    const { activeChoice } = this.state
    const index = flags.indexOf(activeChoice)
    const top = index < 0 ? null : (70 * index) + 80
    return (
      <div className="Dialog FlagDialog">
        <h2>Would you like to flag this content as:</h2>
        <div className="FlagDialogBody">
          { this.renderFlagChoices() }

          <button
            className="FlagDialogButton"
            onClick={ ::this.choiceWasMade }
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

FlagDialog.propTypes = {
  onResponse: PropTypes.func,
  onConfirm: PropTypes.func,
}

export default FlagDialog

