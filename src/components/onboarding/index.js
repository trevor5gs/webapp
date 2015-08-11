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
    // this.props.dispatch(test("wait 1 second..."))
    // this.props.dispatch(testAsync("goodbye"))
    this.props.dispatch(loadCommunities())
  }

  render() {
    const { message, response } = this.props.communities;
    const users = (response && response.users && response.users.length) ? response.users : ['--']
    return (
      <section className='onboarding'>
        <div>Message: {message}</div>
        <ul>
          {users.map(function(user) {
            return <li>@{user.username}</li>
          })}
        </ul>
      </section>
    )
  }
}

