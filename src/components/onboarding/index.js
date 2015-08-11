import React from 'react'
import { connect } from 'react-redux'
import { test, testAsync, loadCommunities } from '../../actions/CommunityActions'

// This decorator allows you to filter which stores you would like to sync
// This example subscribes to all of them
@connect(state => {
  return state
})

export default class Onboarding extends React.Component {
  componentWillMount() {
    // this.props.dispatch(loadCommunities())
    this.props.dispatch(test("wait 1 second..."))
    this.props.dispatch(testAsync("goodbye"))
  }

  render() {
    return (
      <section className='onboarding'>
        <div>Yo: {this.props.communities.message}</div>
      </section>
    )
  }
}

