import React from 'react'
import { connect } from 'react-redux'
import Paginator from './Paginator'
import { ElloMark } from '../interface/ElloIcons'
import { findBy } from '../base/json_helper'
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { addScrollObject, removeScrollObject } from '../interface/ScrollComponent'
import { runningFetches } from '../../middleware/requester'

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

  componentWillReceiveProps(nextProps) {
    const { stream } = nextProps
    // TODO: make this work for nested stream components separately of others on the page
    if (this.refs.paginator && stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.refs.paginator.setLoading(false)
    }
  }

  // this prevents nested stream components from clobbering parents
  shouldComponentUpdate() {
    const { action } = this.state
    const { router, stream } = this.props
    const pathArr = router.location.pathname.split('/')
    // TODO: potentially whitelist the actions that we would want to render on
    if (!action || !action.payload || !stream || !stream.payload) {
      return false
    } else if (stream.type && (stream.type.indexOf('POST.') === 0 || stream.type.indexOf('LOAD_NEXT_CONTENT') === 0)) {
      return true
    } else if (action.payload.endpoint === stream.payload.endpoint) {
      return true
    } else if (stream.meta && stream.meta.resultKey && stream.payload.endpoint.path.match(stream.meta.resultKey)) {
      // if we are a nested stream component and the resultKey
      // ie: lovers as a resultKey for the endpoint for post lovers
      return true
    } else if (stream.payload.endpoint && stream.payload.endpoint.path && stream.payload.endpoint.path.match(pathArr[pathArr.length - 1])) {
      // is used to match the endpoint required to load it
      return true
    }
    return false
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
    this.loadPage('next', true)
  }

  onLoadNextPage() {
    this.loadPage('next')
  }

  setAction(action) {
    this.setState({action: action})
    this.props.dispatch(action)
  }

  loadPage(rel, scrolled = false) {
    const { dispatch, json, router } = this.props
    const { action } = this.state
    const { meta } = action
    let result = null
    if (json.pages) {
      if (meta && meta.resultKey) {
        result = json.pages[`${router.location.pathname}_${meta.resultKey}`]
      } else {
        result = json.pages[router.location.pathname]
      }
    }
    if (!result) { return }
    if (scrolled && meta && meta.resultKey) { return }
    const { pagination } = result
    if (!pagination[rel] || parseInt(pagination.totalPagesRemaining, 10) === 0 || !action) { return }
    if (runningFetches[pagination[rel]]) { return }
    this.refs.paginator.setLoading(true)
    const infiniteAction = {
      ...action,
      type: ACTION_TYPES.LOAD_NEXT_CONTENT,
      payload: {
        endpoint: { path: pagination[rel] },
      },
      meta: {
        mappingType: action.payload.endpoint.pagingPath || meta.mappingType,
        resultFilter: meta.resultFilter,
        resultKey: meta.resultKey,
      },
    }
    dispatch(infiniteAction)
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
      <section className="StreamComponent">
        <p>NO RESULTS</p>
      </section>
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
        if (json[result.type][id]) {
          renderObj.data.push(json[result.type][id])
        }
      }
      if (result.next) {
        const dataProp = payload.endpoint.pagingPath ? 'nestedData' : 'data'
        for (const nextId of result.next.ids) {
          if (json[result.next.type][nextId]) {
            renderObj[dataProp].push(json[result.next.type][nextId])
          }
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
        <Paginator
          delegate={this}
          hasShowMoreButton={typeof meta.resultKey !== 'undefined'}
          key={`${meta.resultKey || 'stream'}Paginator`}
          pagination={result ? result.pagination : {}}
          ref="paginator" />
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

