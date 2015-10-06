/* eslint no-console: 0 */
import React from 'react'
import { connect } from 'react-redux'
import { ElloMark } from '../iconography/ElloIcons'
import { findBy } from '../../util/json_helper'

export class StreamComponent extends React.Component {
  componentWillMount() {
    const { action, dispatch, initModel, json } = this.props
    if (!this.findModel(json, initModel)) {
      console.log('dispatch action')
      action ? dispatch(action) : console.error('Action is required to load a stream')
    }
  }

  componentDidMount() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
  }

  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
  }

  findModel(json, initModel) {
    if (!initModel || !initModel.findObj || !initModel.collection) {
      return null
    }
    return findBy(initModel.findObj, initModel.collection, json)
  }

  renderError() {
    return (
      <section className="StreamComponent hasErrored">
        <div className="StreamErrorMessage">
          <img src="/static/images/support/ello-spin.gif" alt="Ello" width="130" height="130" />
          <p>This doesn't happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn't work you can <a href="http://ello.co/">head back to the homepage.</a></p>
          <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
          <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank">Store</a> or the <a href="https://ello.co/wtf/post/communitydirectory">Community Directory</a>.</p>
        </div>
      </section>
    )
  }

  renderLoading() {
    return (
      <section className="StreamComponent isBusy">
        <div className="StreamBusyIndicator">
          <ElloMark />
        </div>
      </section>
    )
  }

  render() {
    const { initModel, json, meta, payload, result, stream } = this.props
    if (stream.error) {
      return this.renderError()
    }
    const jsonables = []
    const model = this.findModel(json, initModel)
    if (model) {
      jsonables.push(model)
      console.log('found a model')
    } else if (!result || !result.type || !result.ids) {
      return this.renderLoading()
      console.log('no model or result')
    } else {
      for (const id of result.ids) {
        jsonables.push(json[result.type][id])
      }
    }
    if (!jsonables.length || !meta) {
      return this.renderLoading()
      console.log('no jsonables or meta')
    }
    console.log('StreamComponent.render', jsonables)
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
    payload: state.stream.payload,
    stream: state.stream,
  }
}

StreamComponent.propTypes = {
  action: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  json: React.PropTypes.object.isRequired,
  meta: React.PropTypes.object,
  initModel: React.PropTypes.object,
  payload: React.PropTypes.object,
  result: React.PropTypes.shape({
    ids: React.PropTypes.array,
    type: React.PropTypes.string,
  }),
  stream: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(StreamComponent)

