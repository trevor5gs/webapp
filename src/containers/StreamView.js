import React from 'react'
import { connect } from 'react-redux'

// This decorator allows you to filter which stores you would like to sync
// This example subscribes to all of them
@connect(state => {
  return state
})

export default class StreamView extends React.Component {
  render() {
    const { payload, error, meta } = this.props.stream
    if (!payload || !meta) {
      return <div/>
    }
    const { response } = payload
    const { mappingType } = meta
    const json = (response && response[mappingType] && response[mappingType].length) ? response[mappingType] : []
    return (
      <section className='stream-view'>
        { json.length ? this.renderStream(json) : '' }
      </section>
    )
  }

  renderStream(json) {
    return(
      <ul>
        {json.map(function(user) {
          return <li>@{user.username}</li>
          })}
      </ul>
    )
  }
}

