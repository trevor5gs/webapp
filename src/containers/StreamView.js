import React from 'react'
import { connect } from 'react-redux'

class StreamView extends React.Component {

  render() {
    const { error, meta, payload } = this.props.stream
    if (!payload || !meta) {
      return <div/>
    }
    const { response } = payload
    const { mappingType } = meta
    const json = (response && response[mappingType] && response[mappingType].length) ? response[mappingType] : []
    return (
      <section className='stream-view'>
        { json.length ? meta.renderStream(json, payload.vo) : '' }
      </section>
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

