import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

@connect(state => {
  return state
})

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <li><Link to="/onboarding/communities">Communities</Link></li>
        <li><Link to="/onboarding/awesome-people">Awesome People</Link></li>
      </div>
    )
  }
}

