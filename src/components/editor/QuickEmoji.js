import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Emoji from '../assets/Emoji'
import { SVGIcon } from '../interface/SVGComponents'

// Usage:

// onInsertEmoji = ({ value }) => {
//   console.log('insert the value', value)
// };

// <QuickEmoji onAddEmoji={ this.onInsertEmoji }/>

const MiniElloEmoji = () =>
  <SVGIcon className="MiniElloEmoji">
    <g fill="none">
      <circle cx="9" cy="9" r="6"/>
      <path d="M12.5 9c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5"/>
    </g>
  </SVGIcon>


const QuickEmojiChoiceButton = ({ name, onClick }) =>
  <button className="QuickEmojiChoiceButton" name={ name } onClick={ onClick }>
    <Emoji name={ name } />
  </button>


class QuickEmoji extends Component {

  static propTypes = {
    onAddEmoji: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: false }
  }

  buttonWasClicked = () => {
    this.setState({ isActive: !this.state.isActive })
  };

  emojiWasClicked = (e) => {
    const { onAddEmoji } = this.props
    onAddEmoji({ value: `:${e.target.name}:` })
    this.setState({ isActive: false })
  };

  renderEmojis() {
    return (
      <div className="QuickEmojiList">
        <QuickEmojiChoiceButton name="ello" onClick={ this.emojiWasClicked }/>
        <QuickEmojiChoiceButton name="v" onClick={ this.emojiWasClicked }/>
        <QuickEmojiChoiceButton name="bread" onClick={ this.emojiWasClicked }/>
        <QuickEmojiChoiceButton name="metal" onClick={ this.emojiWasClicked }/>
      </div>
    )
  }

  render() {
    const { isActive } = this.state
    return (
      <div className={ classNames('QuickEmoji', { isActive })}>
        <button className="QuickEmojiButton" onClick={ this.buttonWasClicked }>
          <MiniElloEmoji/>
        </button>
        { isActive ? this.renderEmojis() : <div className="QuickEmojiList"></div> }
      </div>
    )
  }
}

export default QuickEmoji

