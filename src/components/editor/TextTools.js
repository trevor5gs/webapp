import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { LinkIcon } from './EditorIcons'

export default class TextTools extends Component {

  static propTypes = {
    activeTools: PropTypes.shape({
      isBoldActive: PropTypes.bool,
      isItalicActive: PropTypes.bool,
      isLinkActive: PropTypes.bool,
    }),
    coordinates: PropTypes.shape({
      left: PropTypes.number,
      top: PropTypes.number,
    }),
    isHidden: PropTypes.bool,
    text: PropTypes.string,
  };

  static defaultProps = {
    isHidden: true,
    activeTools: {
      isBoldActive: false,
      isItalicActive: false,
      isLinkActive: false,
    },
    text: '',
  };

  componentWillMount() {
    const { text } = this.props
    this.state = {
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
    if (text.length) {
      this.setState({ isLinkActive: !isLinkActive })
    }
  };

  handleBoldToggle = () => {
    // const { isBoldActive } = this.state
    // this.setState({ isBoldActive: !isBoldActive })
    document.execCommand('bold', false, true)
  };

  handleItalicToggle = () => {
    // const { isItalicActive } = this.state
    // this.setState({ isItalicActive: !isItalicActive })
    document.execCommand('italic', false, true)
  };

  handleLinkToggle = () => {
    const { isLinkActive } = this.state
    this.setState({ isLinkActive: !isLinkActive })
  };

  render() {
    const { text } = this.state
    const { activeTools, coordinates, isHidden } = this.props
    const { isBoldActive, isItalicActive, isLinkActive } = activeTools
    const asShowLinkForm = isLinkActive
    return (
      <div
        style={ coordinates }
        className={ classNames('TextTools', { asShowLinkForm, isHidden }) }
      >
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

