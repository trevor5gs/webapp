import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { test, testAsync, loadCommunities, loadAwesomePeople } from '../actions/CommunityActions'

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

  asyncButtonWasClicked() {
    this.props.dispatch(test('wait 1 second...'))
    this.props.dispatch(testAsync('async fired'))
  }

  render() {
    return (
      <div>
        <button onClick={() => this.communitiesButtonWasClicked() }>Load Communities</button>
        <button onClick={() => this.asyncButtonWasClicked() }>Async message</button>
        <button onClick={() => this.awesomePeopleButtonWasClicked() }>Load Awesome People</button>
      </div>
    )
  }
}

// WTF is this?
Navbar.propTypes = {
  loadCommunities: PropTypes.func.isRequired,
  loadAwesomePeople: PropTypes.func.isRequired,
  test: PropTypes.func.isRequired,
  testAsync: PropTypes.func.isRequired
};

export default Navbar

