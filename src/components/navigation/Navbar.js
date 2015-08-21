import React from 'react'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'

class Navbar extends React.Component {
  render() {
    return (
      <nav className="Navbar" role="navigation">
        <Link to="/">
          <ElloMark />
        </Link>
        <div className="NavbarLinks">
          <Link to="/discover">Discover</Link>
          <Link to="/search">Search</Link>
          <Link to="/onboarding/channels">Onboarding</Link>
        </div>
      </nav>
    )
  }
}

export default Navbar

