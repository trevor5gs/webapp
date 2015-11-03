import React from 'react'
import { Link } from 'react-router'
import { ElloMark, ElloRainbowMark } from '../iconography/ElloIcons'

class NavbarMark extends React.Component {

  renderMark() {
    switch (ENV.LOGO_MARK) {
    case 'rainbow':
      return <ElloRainbowMark />
    case 'none':
      return null
    case 'normal':
    default:
      return <ElloMark />
    }
  }

  render() {
    return (
      <Link className="NavbarMark" to="/">
        { this.renderMark() }
      </Link>
    )
  }
}

export default NavbarMark

