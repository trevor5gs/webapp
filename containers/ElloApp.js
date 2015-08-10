import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCommunities } from '../actions/CommunityActions'

class ElloApp extends Component {
  render() {
    const { communities, dispatch } = this.props;
    return (
      <div>
        <p>Hello Ello {communities}</p>
        <button onClick={() => dispatch(loadCommunities())}>Load some shit</button>
      </div>
    );
  }
}

function select(state) {
  return {
    communities: state.communities
  }
}

export default connect(select)(ElloApp);
