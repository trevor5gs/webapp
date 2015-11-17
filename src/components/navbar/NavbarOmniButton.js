import React from 'react'
import { PencilIcon } from '../navbar/NavbarIcons'

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

