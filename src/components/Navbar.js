import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <Link to="/onboarding/communities" style={linkStyles}>Communities</Link>
        <Link to="/onboarding/awesome-people" style={linkStyles}>Awesome People</Link>
      </div>
    )
  }
}


let linkStyles = {
  marginLeft: 20,
  fontFamily: 'sans-serif'
}

