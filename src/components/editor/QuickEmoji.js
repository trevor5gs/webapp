import React, { PropTypes, PureComponent } from 'react'
import sampleSize from 'lodash/sampleSize'
import Emoji from '../assets/Emoji'
import { ElloQuickEmoji } from '../assets/Icons'

const options = [
  '+1', 'sparkles', 'metal', 'ok_hand', 'v', 'snowman', 'heart', 'panda_face',
  'clap', 'boom', 'star', 'wave', 'raised_hands', 'dizzy', 'sparkling_heart',
  'muscle', 'fire', 'fist', 'ello', 'bread',
]

const QuickEmojiChoiceButton = ({ name, onClick }) =>
  <button className="QuickEmojiChoiceButton" name={name} onClick={onClick}>
    <Emoji name={name} />
  </button>

QuickEmojiChoiceButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

class QuickEmoji extends PureComponent {

  static propTypes = {
    onAddEmoji: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: false }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
    document.removeEventListener('touchstart', this.onDocumentClick)
  }

  onDocumentClick = () => {
    this.hide()
  }

  show = () => {
    this.setState({ isActive: true })
    document.addEventListener('click', this.onDocumentClick)
    document.addEventListener('touchstart', this.onDocumentClick)
  }

  hide = () => {
    this.setState({ isActive: false })
    document.removeEventListener('click', this.onDocumentClick)
    document.removeEventListener('touchstart', this.onDocumentClick)
  }

  emojiWasClicked = (e) => {
    const { onAddEmoji } = this.props
    onAddEmoji({ value: `:${e.target.name}:` })
    this.hide()
  }

  renderEmojis() {
    const samples = sampleSize(options, 4)
    return samples.map(sample =>
      <QuickEmojiChoiceButton key={sample} name={sample} onClick={this.emojiWasClicked} />,
    )
  }

  render() {
    const { isActive } = this.state
    if (isActive) {
      return (
        <div className="QuickEmoji isActive">
          <div className="QuickEmojiList">
            {this.renderEmojis()}
          </div>
        </div>
      )
    }
    return (
      <div className="QuickEmoji">
        <button className="QuickEmojiButton" onClick={this.show}>
          <ElloQuickEmoji />
        </button>
        <div className="QuickEmojiList" />
      </div>
    )
  }
}

export default QuickEmoji

