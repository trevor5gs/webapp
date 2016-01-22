import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

class ToggleControl extends Component {

  constructor(props, context) {
    super(props, context)
    const { isChecked } = this.props
    this.state = {
      checked: isChecked,
    }
    this.handleChange = ::this.handleChange
  }

  componentWillReceiveProps(nextProps) {
    const { isChecked } = nextProps
    const { checked } = this.state
    if (checked !== isChecked) {
      this.setState({
        checked: isChecked,
      })
    }
  }

  handleChange() {
    const { onChange, id } = this.props
    const { checked } = this.state
    const newCheckedState = !checked
    this.setState({ checked: newCheckedState })
    if (typeof onChange === 'function') {
      onChange({ [id]: newCheckedState })
    }
  }

  render() {
    const { className, id, isDisabled } = this.props
    const { checked } = this.state
    return (
      <label
        className={ classNames('ToggleControl', className, { isChecked: checked })}
        disabled={ isDisabled }
        htmlFor={ id }
      >
        <input
          id={ id }
          type="checkbox"
          checked={ checked }
          onChange={ this.handleChange }
        />
        <span>{ checked ? 'Yes' : 'No' }</span>
      </label>
    )
  }

}

ToggleControl.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
}

export default ToggleControl

