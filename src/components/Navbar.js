import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { test, testAsync, loadCommunities, loadAwesomePeople } from '../actions/community_actions'

@connect(state => {
  return state
})

class Navbar extends Component {

  communitiesButtonWasClicked() {
    this.props.dispatch(loadCommunities())
  }

  awesomePeopleButtonWasClicked() {
    this.props.dispatch(loadAwesomePeople())
  }

  render() {
    return (
      <div>
        <button onClick={() => this.communitiesButtonWasClicked() }>Load Communities</button>
        <button onClick={() => this.awesomePeopleButtonWasClicked() }>Load Awesome People</button>
      </div>
    )
  }
}

// WTF is this?
Navbar.propTypes = {
  loadCommunities: PropTypes.func.isRequired,
  loadAwesomePeople: PropTypes.func.isRequired
};

export default Navbar

