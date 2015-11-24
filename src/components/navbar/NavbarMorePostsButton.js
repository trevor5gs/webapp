import React from 'react'

class NavbarMorePostsButton extends React.Component {

  render() {
    const { callback } = this.props
    return (
      <button onClick={callback} className="more-btn" name="prependPosts">
        <span>More Posts</span>
      </button>
    )
  }
}

NavbarMorePostsButton.propTypes = {
  callback: React.PropTypes.func,
}

export default NavbarMorePostsButton

