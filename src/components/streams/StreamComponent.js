/* eslint no-console: 0 */
import React from 'react'
import { connect } from 'react-redux'

class StreamComponent extends React.Component {

  componentWillMount() {
    this.props.action ? this.props.dispatch(this.props.action()) : console.error('Action is required to load a stream')
  }

  render() {
    const { meta, payload } = this.props.stream
    if (!payload || !meta) {
      return <div/>
    }
    const { response } = payload
    const { mappingType } = meta
    const json = (response && response[mappingType] && response[mappingType].length) ? response[mappingType] : []
    return (
      <section className="StreamComponent">
        { json.length ? meta.renderStream(json, payload.vo) : '' }
      </section>
    )
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    stream: state.stream,
  }
}

export default connect(mapStateToProps)(StreamComponent)

