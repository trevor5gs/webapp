import React, { Component, PropTypes } from 'react'

class NavbarMorePostsButton extends Component {
  static propTypes = {
    callback: PropTypes.func,
  }

  render() {
    const { callback } = this.props
    return (
      <button onClick={callback} className="NavbarMorePostsButton">
        <span>More Posts</span>
      </button>
    )
  }
}

export default NavbarMorePostsButton

