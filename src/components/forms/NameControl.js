import React from 'react'
import classNames from 'classnames'

class NameControl extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { text, hasFocus } = this.props
    this.state = {
      text: text || '',
      hasFocus: hasFocus || false,
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }

  render() {
    const { id, placeholder, name, tabIndex } = this.props
    return (
      <div className={classNames('FormControlGroup', { hasFocus: this.state.hasFocus })}>
        <label className="FormControlLabel" htmlFor={id}>Name</label>
        <input
          className="FormControl"
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
}

export default NameControl

