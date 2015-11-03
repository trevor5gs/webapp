import React from 'react'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'


class NavbarMark extends React.Component {

  render() {
    // const { ENV.LOGOMARK, username} = this.props

    return (
      <Link className="NavbarMark" to="/">
        <ElloMark />
      </Link>
    )
  }
}

NavbarMark.propTypes = {
  avatar: React.PropTypes.object,
  username: React.PropTypes.string,
}

export default NavbarMark


