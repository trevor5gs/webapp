import React from 'react'
import { Link } from 'react-router'
import { ElloMark, ElloRainbowMark, ElloDonutMark } from '../interface/ElloIcons'

function getLogoMarkFromEnvironment() {
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

const NavbarMark = () =>
  <Link className="NavbarMark" to="/explore">
    { getLogoMarkFromEnvironment() }
  </Link>

export default NavbarMark

