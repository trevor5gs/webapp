import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class LinksControl extends Component {
  static propTypes = {
    controlWasChanged: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    tabIndex: PropTypes.string.isRequired,
    text: PropTypes.string,
  }

  static defaultProps = {
    id: 'user_links',
    name: 'user[links]',
    placeholder: 'Links (optional)',
    tabIndex: '0',
    text: '',
  }

  constructor(props, context) {
    super(props, context)
    const { text } = this.props
    this.state = {
      text: text,
      hasValue: text && text.length,
      hasFocus: false,
    }
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }

  handleChange(e) {
    const val = e.target.value
    this.setState({ text: val, hasValue: val.length })
    this.props.controlWasChanged({ external_links: e.target.value })
  }

  render() {
    const { id, name, tabIndex, placeholder } = this.props
    const { hasFocus, hasValue, text } = this.state
    const groupClassNames = classNames(
      'FormControlGroup',
      { hasFocus: hasFocus },
      { hasValue: hasValue },
    )

    return (
      <div className={groupClassNames}>
        <label className="FormControlLabel" htmlFor={id}>Links</label>
        <input
          className="FormControl LinksControl"
          id={id}
          name={name}
          value={text}
          type="text"
          tabIndex={tabIndex}
          placeholder={placeholder}
          maxLength="50"
          autoCapitalize="off"
          autoCorrect="off"
          onFocus={(e) => this.handleFocus(e)}
          onBlur={(e) => this.handleBlur(e)}
          onChange={(e) => this.handleChange(e)} />
      </div>
    )
  }
}

export default LinksControl

