import React, { Component } from 'react'
import { Link } from 'react-router'
import { ElloMark, ElloRainbowMark, ElloDonutMark } from '../interface/ElloIcons'
import * as ENV from '../../../env'

class NavbarMark extends Component {
  renderMark() {
    switch (ENV.LOGO_MARK) {
      case 'rainbow':
        return <ElloRainbowMark />
      case 'donut':
        return <ElloDonutMark />
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

