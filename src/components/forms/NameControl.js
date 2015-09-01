import React from 'react'
import classNames from 'classnames'

class NameControl extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { text, hasFocus } = this.props
    this.state = {
      text: text || '',
      hasValue: text ? text.length : false,
      hasFocus: hasFocus || false,
    }
  }

  handleChange(e) {
    const val = e.target.value
    this.props.controlWasChanged({ name: val })
    this.setState({ text: val, hasValue: val.length })
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }

  render() {
    const { id, placeholder, name, tabIndex } = this.props
    const klassNames = classNames(
      'FormControlGroup',
      { hasFocus: this.state.hasFocus },
      { hasValue: this.state.hasValue },
    )
    return (
      <div className={klassNames}>
        <label className="FormControlLabel" htmlFor={id}>Name</label>
        <input
          className="FormControl NameControl"
          id={id}
          placeholder={placeholder}
          value={this.state.text}
          name={name}
          tabIndex={tabIndex}
          type="text"
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


NameControl.defaultProps = {
  placeholder: 'Name (optional)',
  id: 'user_name',
  name: 'user[name]',
  tabIndex: 0,
}

NameControl.propTypes = {
  placeholder: React.PropTypes.string,
  tabIndex: React.PropTypes.string,
  text: React.PropTypes.string,
  name: React.PropTypes.string,
  id: React.PropTypes.string,
  hasFocus: React.PropTypes.func,
  controlWasChanged: React.PropTypes.func.isRequired,
}

export default NameControl

