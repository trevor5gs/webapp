import React from 'react'
import { Link } from 'react-router'

class Navbar extends React.Component {
  render() {
    return (
      <nav className="Navbar" role="navigation">
        <Link to="/" className="tmp">Home</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/search">Search</Link>
        <Link to="/onboarding/channels">Onboarding</Link>
      </nav>
    )
  }
}

export default Navbar

