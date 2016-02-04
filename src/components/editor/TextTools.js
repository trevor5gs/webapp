import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { LinkIcon } from './EditorIcons'

export default class TextTools extends Component {

  static propTypes = {
    isHidden: PropTypes.bool,
    text: PropTypes.string,
  };

  static defaultProps = {
    isHidden: true,
    text: '',
  };

  componentWillMount() {
    const { text } = this.props
    this.state = {
      isBoldActive: false,
      isItalicActive: false,
      isLinkActive: false,
      hasFocus: false,
      hasValue: text && text.length,
      isInitialValue: true,
      text,
    }
    this.initialValue = text
  }

  handleFocus = () => {
    this.setState({ hasFocus: true })
  };

  handleBlur = () => {
    this.setState({ hasFocus: false })
  };

  handleChange = (e) => {
    const val = e.target.value
    this.setState({
      hasValue: val.length,
      isInitialValue: val === this.initialValue,
      text: val,
    })
  };

  handleSubmit = (e) => {
    e.preventDefault()
    const { isLinkActive, text } = this.state
    this.setState({ isLinkActive: !isLinkActive })
    console.log('form submitted', text)
  };

  handleBoldToggle = () => {
    const { isBoldActive } = this.state
    this.setState({ isBoldActive: !isBoldActive })
  };

  handleItalicToggle = () => {
    const { isItalicActive } = this.state
    this.setState({ isItalicActive: !isItalicActive })
  };

  handleLinkToggle = () => {
    const { isLinkActive } = this.state
    this.setState({ isLinkActive: !isLinkActive })
  };

  render() {
    const { isBoldActive, isItalicActive, isLinkActive, text } = this.state
    const { isHidden } = this.props
    const asShowLinkForm = isLinkActive
    return (
      <div className={ classNames('TextTools', { asShowLinkForm, isHidden }) }>
        <button
          className={ classNames('TextToolButton forBold', { isActive: isBoldActive }) }
          onClick={ this.handleBoldToggle }
        >
          <strong>B</strong>
        </button>
        <button
          className={ classNames('TextToolButton forItalic', { isActive: isItalicActive }) }
          onClick={ this.handleItalicToggle }
        >
          <em>I</em>
        </button>
        <button
          className={ classNames('TextToolButton', { isActive: isLinkActive }) }
          onClick={ this.handleLinkToggle }
        >
          <LinkIcon />
        </button>
        <form
          className="TextToolForm"
          noValidate="novalidate"
          onSubmit={ this.handleSubmit }
        >
          <input
            className="TextToolLinkInput"
            onFocus={ this.handleFocus }
            onBlur={ this.handleBlur }
            onChange={ this.handleChange }
            placeholder="Add Link..."
            tabIndex="0"
            type="url"
            value={ text }
          />
        </form>
      </div>
    )
  }
}

