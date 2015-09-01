/* eslint no-console: 0 */
import React from 'react'
import { connect } from 'react-redux'

class StreamComponent extends React.Component {
  componentWillMount() {
    const { action, dispatch } = this.props
    action ? dispatch(action()) : console.error('Action is required to load a stream')
  }

  render() {
    const { meta, payload } = this.props.stream
    const { json, result } = this.props
    const jsonables = []
    for (const key in result) {
      if ({}.hasOwnProperty.call(result, key)) {
        for (const id of result[key]) {
          jsonables.push(json[key][id])
        }
      }
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
    stream: state.stream,
  }
}

StreamComponent.propTypes = {
  action: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  json: React.PropTypes.object.isRequired,
  result: React.PropTypes.object,
  stream: React.PropTypes.shape({
    meta: React.PropTypes.object,
    payload: React.PropTypes.object,
  }).isRequired,
}

export default connect(mapStateToProps)(StreamComponent)

