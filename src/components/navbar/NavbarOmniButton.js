import React, { Component, PropTypes } from 'react'
import { PencilIcon } from '../navbar/NavbarIcons'

class NavbarOmniButton extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
  }

  render() {
    const { callback } = this.props
    return (
      <button className="NavbarOmniButton" onClick={callback}>
        <PencilIcon />
        <span>Post</span>
      </button>
    )
  }
}

export default NavbarOmniButton

