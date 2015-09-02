import React from 'react'
import classNames from 'classnames'
import FormControl from './FormControl'

class LinksControl extends FormControl {
  handleChange(e) {
    this.props.controlWasChanged({ externalLinks: e.target.value })
    super.handleChange(e)
  }

  render() {
    const { id, name, inputType, tabIndex, placeholder } = this.props
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
          type={inputType}
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

LinksControl.defaultProps = {
  placeholder: 'Links (optional)',
  id: 'user_links',
  name: 'user[links]',
  inputType: 'text',
  tabIndex: 0,
}

LinksControl.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  inputType: React.PropTypes.string.isRequired,
  tabIndex: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  controlWasChanged: React.PropTypes.func.isRequired,
}

export default LinksControl

