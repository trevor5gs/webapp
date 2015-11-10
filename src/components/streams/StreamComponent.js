import React from 'react'
import { connect } from 'react-redux'
import { ElloMark } from '../iconography/ElloIcons'
import { findBy } from '../base/json_helper'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { addScrollObject, removeScrollObject } from '../scroll/ScrollComponent'

export class StreamComponent extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = { action: this.props.action }
  }

  componentWillMount() {
    const { action } = this.state
    if (action) { this.props.dispatch(action) }
  }

  componentDidMount() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    addScrollObject(this)
  }

  // this prevents nested stream components from clobbering parents
  shouldComponentUpdate() {
    const { action } = this.state
    const { stream } = this.props
    // return true for post tools actions
    if (!action || !action.payload || !stream || !stream.payload) {
      return false
    } else if (stream.type && stream.type.indexOf('POST.') === 0) {
      return true
    }
    return action.payload.endpoint === stream.payload.endpoint
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
    removeScrollObject(this)
  }

  onScrollBottom() {
    this.loadPage('next')
  }

  setAction(action) {
    this.setState({action: action})
    this.props.dispatch(action)
  }

  loadPage(rel) {
    const { dispatch, json, router } = this.props
    const { action } = this.state
    // resultKey lets us know that this is a nested stream component
    // and should not load pages ie: lovers, reposters
    if (action && action.meta && action.meta.resultKey) { return }
    const result = json.pages ? json.pages[router.location.pathname] : null
    const { pagination } = result
    if (!pagination[rel] || parseInt(pagination.totalPagesRemaining, 10) === 0 || !action) { return }
    dispatch(
      {
        type: ACTION_TYPES.LOAD_NEXT_CONTENT,
        payload: { endpoint: { path: pagination[rel] } },
        meta: { mappingType: action.payload.endpoint.pagingPath || action.meta.mappingType, resultFilter: action.meta.resultFilter },
      }
    )
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

  renderZeroState() {
    return (
      <div>NO RESULTS</div>
    )
  }

  render() {
    const { currentUser, initModel, json, router, stream } = this.props
    const { action } = this.state
    if (!action) { return null }
    const { meta, payload } = action
    let result = null
    if (json.pages) {
      if (meta && meta.resultKey) {
        result = json.pages[`${router.location.pathname}_${meta.resultKey}`]
      } else {
        result = json.pages[router.location.pathname]
      }
    }
    if (stream.error) {
      return this.renderError()
    }
    const renderObj = { data: [], nestedData: [] }
    const model = this.findModel(json, initModel)
    if (model && !result) {
      renderObj.data.push(model)
    } else if (!result || !result.type || !result.ids) {
      return this.renderLoading()
    } else if (result.type === MAPPING_TYPES.NOTIFICATIONS) {
      renderObj.data = renderObj.data.concat(result.ids)
      if (result.next) {
        renderObj.data = renderObj.data.concat(result.next.ids)
      }
    } else if (result.type === meta.mappingType || (meta.resultFilter && result.type !== meta.mappingType)) {
      for (const id of result.ids) {
        renderObj.data.push(json[result.type][id])
      }
      if (result.next) {
        const dataProp = payload.endpoint.pagingPath ? 'nestedData' : 'data'
        for (const nextId of result.next.ids) {
          renderObj[dataProp].push(json[result.next.type][nextId])
        }
      }
    }
    if (!renderObj.data.length) {
      if (stream.type === ACTION_TYPES.LOAD_STREAM_REQUEST || !meta) {
        return this.renderLoading()
      }
      return this.renderZeroState()
    }
    return (
      <section className="StreamComponent">
        { meta.renderStream(renderObj, json, currentUser, payload.vo) }
      </section>
    )
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    json: state.json,
    currentUser: state.profile.payload,
    router: state.router,
    stream: state.stream,
  }
}

StreamComponent.propTypes = {
  action: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  json: React.PropTypes.object.isRequired,
  initModel: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  router: React.PropTypes.object.isRequired,
  stream: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, null, null, { withRef: true })(StreamComponent)

