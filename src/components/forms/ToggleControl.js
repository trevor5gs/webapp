import React, { PropTypes, PureComponent } from 'react'
import classNames from 'classnames'
import { CheckIcon, XIcon } from '../assets/Icons'

class ToggleControl extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    hasIcon: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isChecked: false,
    isDisabled: false,
    hasIcon: false,
  }

  componentWillMount() {
    const { isChecked } = this.props
    this.state = {
      checked: isChecked,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isChecked } = nextProps
    const { checked } = this.state
    if (checked !== isChecked && typeof isChecked !== 'undefined') {
      this.setState({
        checked: isChecked,
      })
    }
  }

  onChangeControl = () => {
    const { onChange, id } = this.props
    const { checked } = this.state
    const newCheckedState = !checked
    this.setState({ checked: newCheckedState })
    if (typeof onChange === 'function') {
      onChange({ [id]: newCheckedState })
    }
  }

  render() {
    const { id, isDisabled, hasIcon } = this.props
    const { checked } = this.state
    return (
      <label
        className={classNames('ToggleControl', { isChecked: checked })}
        disabled={isDisabled}
        htmlFor={id}
      >
        <input
          checked={checked}
          className="invisible"
          id={id}
          onChange={this.onChangeControl}
          type="checkbox"
        />
        {hasIcon &&
          <span className="ToggleControlIcon">
            {checked ? <CheckIcon /> : <XIcon />}
          </span>
        }
        <span>{checked ? 'Yes' : 'No'}</span>
      </label>
    )
  }
}

export default ToggleControl

