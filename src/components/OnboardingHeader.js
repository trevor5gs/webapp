import React from 'react'
import { Link } from 'react-router'

export default class OnboardingHeader extends React.Component {
  render() {
    console.log(this.props)
    return (
      <div style={navStyles}>
        <h1>{this.props.title}</h1>
        <p>{this.props.message}</p>
        <Link to={this.props.nextPath} style={linkStyles}>Next</Link>
        <Link to={this.props.nextPath} style={linkStyles}>Skip</Link>
      </div>
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
  height: 245,
  backgroundColor: 'white',
}

