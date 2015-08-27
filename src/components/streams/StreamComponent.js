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

StreamComponent.propTypes = {
  className: React.PropTypes.string,
  classListName: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
}

StreamComponent.propTypes = {
  action: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  stream: React.PropTypes.shape({
    meta: React.PropTypes.object,
    payload: React.PropTypes.object,
  }).isRequired,
}

export default connect(mapStateToProps)(StreamComponent)

