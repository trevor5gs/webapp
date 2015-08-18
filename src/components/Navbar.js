import React from 'react'
import { Link } from 'react-router'

class Navbar extends React.Component {
  render() {
    return (
      <nav style={navStyles}>
        <Link to="/" style={linkStyles}>Home</Link>
        <Link to="/search" style={linkStyles}>Search</Link>
        <Link to="/discover" style={linkStyles}>Discover</Link>
        <Link to="/onboarding/channels" style={linkStyles}>Onboarding</Link>
      </nav>
    )
  }
}

let baseButton = {
  fontFamily: 'sans-serif',
  display: 'inline-block'
}


let linkStyles = {
  ...baseButton,
  marginLeft: 20,
}

let navStyles = {
  height: 120,
  backgroundColor: 'white',
}

export default Navbar
