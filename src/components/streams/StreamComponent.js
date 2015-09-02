/* eslint no-console: 0 */
import React from 'react'
import { connect } from 'react-redux'

class StreamComponent extends React.Component {
  componentWillMount() {
    const { action, dispatch } = this.props
    action ? dispatch(action()) : console.error('Action is required to load a stream')
  }

  render() {
    const { json, mappingType, meta, payload, result } = this.props
    if (!mappingType || !result || !result[mappingType]) {
      return <div/>
    }
    const jsonables = []
    for (const id of result[mappingType]) {
      jsonables.push(json[mappingType][id])
    }
    if (!jsonables.length || !meta) {
      return <div>Loading...</div>
    }
    return (
      <section className="StreamComponent">
        { meta.renderStream(jsonables, json, payload.vo) }
      </section>
    )
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    json: state.json,
    result: state.json.result,
    meta: state.stream.meta,
    mappingType: state.stream.meta ? state.stream.meta.mappingType : null,
    payload: state.stream.payload,
    stream: state.stream,
  }
}

StreamComponent.propTypes = {
  action: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  json: React.PropTypes.object.isRequired,
  result: React.PropTypes.object,
  stream: React.PropTypes.object.isRequired,
  meta: React.PropTypes.object,
  mappingType: React.PropTypes.string,
  payload: React.PropTypes.object,
}

export default connect(mapStateToProps)(StreamComponent)

