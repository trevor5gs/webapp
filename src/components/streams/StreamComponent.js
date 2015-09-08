/* eslint no-console: 0 */
import React from 'react'
import { connect } from 'react-redux'
import { ElloMark } from '../iconography/ElloIcons'

class StreamComponent extends React.Component {
  componentWillMount() {
    const { action, dispatch } = this.props
    action ? dispatch(action()) : console.error('Action is required to load a stream')
  }

  render() {
    const { json, mappingType, meta, payload, result, stream } = this.props

    if (stream.error) {
      return (
        <section className="StreamComponent hasErrored">
          <div className="StreamErrorMessage">
            <img src="/images/support/ello-spin.gif" alt="Ello" width="130" height="130" />
            <p>This doesn't happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
            <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
            <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href="https://ello.co/wtf/post/communitydirectory">Community Directory</a>.</p>
            </div>
        </section>
      )
    }

    if (!mappingType || !result || !result[mappingType]) {
      return <div/>
    }
    const jsonables = []
    for (const id of result[mappingType]) {
      jsonables.push(json[mappingType][id])
    }
    if (!jsonables.length || !meta) {
      return (
        <section className="StreamComponent isBusy">
          <div className="StreamBusyIndicator">
            <ElloMark />
            <p>Loading...</p>
          </div>
        </section>
      )
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

