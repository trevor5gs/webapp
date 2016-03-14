import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
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

const NavbarMark = (props) =>
  <Link className="NavbarMark" to={ props.markTarget }>
    { getLogoMarkFromEnvironment() }
  </Link>

NavbarMark.propTypes = {
  markTarget: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => {
  const { authentication: { isLoggedIn }, gui: { currentStream } } = state
  return {
    markTarget: isLoggedIn ? currentStream : '/',
  }
}

export default connect(mapStateToProps)(NavbarMark)

