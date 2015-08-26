import React from 'react'

class NameControl extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.text || '',
      hasFocus: this.props.hasFocus || false,
    }
  }

  render() {
    const classList = this.state.hasFocus ? 'FormControlGroup has-focus' : 'FormControlGroup'
    return (
      <div className={classList}>
        <label className="FormControlLabel" htmlFor={this.props.id}>Name</label>
        <input
          className="FormControl"
          id={this.props.id}
          placeholder={this.props.placeholder}
          value={this.state.text}
          name={this.props.name}
          tabIndex={this.props.tabIndex}
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

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }

}


NameControl.defaultProps = {
  placeholder: 'Name (optional)',
  id: 'user_name',
  name: 'user[name]',
  tabIndex: 0,
}

export default NameControl

