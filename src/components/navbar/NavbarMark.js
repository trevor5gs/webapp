import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { ElloMark, ElloRainbowMark, ElloDonutMark } from '../svg/ElloIcons'

const getLogoMarkFromEnvironment = () => {
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

export const NavbarMark = ({ currentStream, isLoggedIn, onClick }) =>
<Link
  className="NavbarMark"
  draggable
  onClick={ onClick }
  to={ isLoggedIn ? currentStream : '/' }
>
    { getLogoMarkFromEnvironment() }
  </Link>

NavbarMark.propTypes = {
  currentStream: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

