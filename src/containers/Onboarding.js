import React from 'react'
import { connect } from 'react-redux'

// This decorator allows you to filter which stores you would like to sync
// This example subscribes to all of them
@connect(state => {
  return state
})

export default class Onboarding extends React.Component {
  render() {
    const { payload, error, meta } = this.props.communities
    const users = (payload && payload.response && payload.response.users && payload.response.users.length) ? payload.response.users : []
    return (
      <section className='onboarding'>
        <div>Message: { payload && payload.message ? payload.message : 'Nothing' }</div>
        { users.length ? this.renderUsers(users) : '' }
      </section>
    )
  }

  renderUsers(users) {
    return(
      <ul>
        {users.map(function(user) {
          return <li>@{user.username}</li>
          })}
      </ul>
    )
  }
}

