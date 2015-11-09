import React from 'react'
import { PencilIcon } from '../iconography/Icons'

class NavbarOmniButton extends React.Component {

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

NavbarOmniButton.propTypes = {
  callback: React.PropTypes.func.isRequired,
}

export default NavbarOmniButton

