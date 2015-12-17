import React, { Component, PropTypes } from 'react'
import { ArrowIcon } from '../navbar/NavbarIcons'

class NavbarMorePostsButton extends Component {
  static propTypes = {
    callback: PropTypes.func,
  }

  render() {
    const { callback } = this.props
    return (
      <button onClick={callback} className="NavbarMorePostsButton">
        <ArrowIcon/>
        <span>More Posts</span>
      </button>
    )
  }
}

export default NavbarMorePostsButton

