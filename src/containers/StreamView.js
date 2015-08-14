import React from 'react'
import { connect } from 'react-redux'

class StreamView extends React.Component {

  render() {
    console.log('StreamView#render', this.props)
    const { error, meta, payload } = this.props.stream
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

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    stream: state.stream
  }
}

export default connect(mapStateToProps)(StreamView)

