import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import classNames from 'classnames'
import _ from 'lodash'
import scrollTop from '../vendor/scrolling'
import { runningFetches } from '../sagas/requester'
import * as ACTION_TYPES from '../constants/action_types'
import { SESSION_KEYS } from '../constants/application_types'
import { findModel } from '../helpers/json_helper'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import { ElloMark } from '../components/svg/ElloIcons'
import { Paginator } from '../components/streams/Paginator'
import { ErrorState4xx } from '../components/errors/Errors'
import { makeSelectStreamProps } from '../selectors'
import Session from '../vendor/session'

export function shouldContainerUpdate(thisProps, nextProps, thisState, nextState) {
  const { stream } = nextProps
  const { action } = nextState
  const updateKey = _.get(action, 'meta.updateKey')
  const streamPath = _.get(stream, 'payload.endpoint.path', '')
  // this prevents nested stream components from clobbering parents
  if (updateKey && !streamPath.match(updateKey)) {
    return false
    // when hitting the back button the result can update and
    // try to feed wrong results to the actions render method
    // thus causing errors when trying to render wrong results
  } else if (nextProps.resultPath !== thisProps.resultPath) {
    return false
  } else if (thisProps.columnCount !== nextProps.columnCount && nextProps.isGridMode) {
    return true
    // allow page loads to fall through and also allow stream
    // load requests to fall through to show the loader
    // on an initial page load when endpoints don't match
  } else if (!/LOAD_NEXT_CONTENT|POST\.|COMMENT\./.test(stream.type) &&
             stream.type !== ACTION_TYPES.LOAD_STREAM_REQUEST &&
             streamPath !== _.get(action, 'payload.endpoint.path')) {
    return false
  } else if (_.isEqual(nextState, thisState) && _.isEqual(nextProps, thisProps)) {
    return false
  }
  return true
}

export function makeMapStateToProps() {
  const getStreamProps = makeSelectStreamProps()
  const mapStateToProps = (state, props) => {
    const streamProps = getStreamProps(state, props)
    return {
      ...streamProps,
      columnCount: state.gui.columnCount,
      deviceSize: state.gui.deviceSize,
      history: state.gui.history,
      innerHeight: state.gui.innerHeight,
      innerWidth: state.gui.innerWidth,
      json: state.json,
      isGridMode: state.gui.isGridMode,
      omnibar: state.omnibar,
      routerState: state.routing.location.state || {},
      stream: state.stream,
    }
  }
  return mapStateToProps
}

export class StreamContainer extends Component {

  static propTypes = {
    action: PropTypes.object,
    children: PropTypes.any,
    className: PropTypes.string,
    columnCount: PropTypes.number,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    ignoresScrollPosition: PropTypes.bool.isRequired,
    initModel: PropTypes.object,
    innerHeight: PropTypes.number,
    innerWidth: PropTypes.number,
    isGridMode: PropTypes.bool,
    isModalComponent: PropTypes.bool,
    isUserDetail: PropTypes.bool.isRequired,
    json: PropTypes.object.isRequired,
    omnibar: PropTypes.object,
    paginatorText: PropTypes.string,
    renderObj: PropTypes.object.isRequired,
    result: PropTypes.object.isRequired,
    resultPath: PropTypes.string,
    routerState: PropTypes.object,
    scrollSessionKey: PropTypes.string,
    stream: PropTypes.object.isRequired,
  }

  static defaultProps = {
    paginatorText: 'Loading',
    ignoresScrollPosition: false,
    isUserDetail: false,
    isModalComponent: false,
  }

  componentWillMount() {
    const { action, dispatch, omnibar } = this.props
    if (typeof window !== 'undefined' && action) {
      dispatch(action)
    }

    let browserListen
    if (browserHistory) {
      browserListen = browserHistory.listen
    } else {
      browserListen = (listener) => {
        listener({ key: 'testing' })
        return () => null
      }
    }
    const unlisten = browserListen(location => {
      this.state = { action, locationKey: location.key }
    })
    unlisten()
    this.setDebouncedScroll = _.debounce(this.setDebouncedScroll, 300)
    this.shouldScroll = true
    this.wasOmnibarActive = omnibar.isActive
  }

  componentDidMount() {
    const { routerState } = this.props
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    if (!this.props.isModalComponent) {
      addScrollObject(this)
    }

    let shouldScrollToTop = true
    if (this.props.isUserDetail) {
      this.scrollToUserDetail()
      shouldScrollToTop = false
      this.saveScroll = false
    } else if (routerState.didComeFromSeeMoreCommentsLink) {
      this.saveScroll = false
    } else {
      this.saveScroll = true
    }
    this.attemptToRestoreScroll(shouldScrollToTop)
  }

  componentWillReceiveProps(nextProps) {
    const { stream } = nextProps
    const { action } = this.state
    if (!action) { return }

    if (stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      this.setState({ hidePaginator: true })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldContainerUpdate(this.props, nextProps, this.state, nextState)
  }

  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }

    const { action } = this.state
    const { innerHeight, stream, omnibar, isUserDetail } = this.props
    const canScroll = document.body.scrollHeight > innerHeight
    const shouldScroll = this.shouldScroll && (canScroll ||
      stream.type === ACTION_TYPES.LOAD_STREAM_SUCCESS &&
      action && action.payload &&
      stream.payload.endpoint.path === action.payload.endpoint.path)
    if (shouldScroll) {
      if (this.attemptToRestoreScroll()) {
        this.shouldScroll = false
      }
    }

    if (isUserDetail && !omnibar.isActive && this.wasOmnibarActive) {
      this.scrollToUserDetail()
    }
    this.wasOmnibarActive = omnibar.isActive
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this)
    this.saveScroll = false
  }

  onScroll() {
    this.setDebouncedScroll()
  }

  onScrollBottom() {
    this.loadPage('next', true)
  }

  onLoadNextPage = () => {
    this.loadPage('next')
  }

  setAction(action) {
    this.setState({ action })
    this.props.dispatch(action)
  }

  setDebouncedScroll() {
    this.setScroll()
  }

  setScroll() {
    if (!this.saveScroll) { return }

    let scrollTopValue
    if (this.scrollContainer) {
      scrollTopValue = scrollTop(this.scrollContainer)
    } else {
      scrollTopValue = scrollTop(window)
    }

    if (this.props.scrollSessionKey) {
      const sessionStorageKey = SESSION_KEYS.scrollLocationKey(this.props.scrollSessionKey)
      Session.setItem(sessionStorageKey, scrollTopValue)
    } else {
      this.props.dispatch({
        type: ACTION_TYPES.GUI.SET_SCROLL,
        payload: {
          key: this.state.locationKey,
          scrollTop: scrollTopValue,
        },
      })
    }
  }

  scrollToUserDetail() {
    const { innerWidth } = this.props
    const offset = Math.round((innerWidth * 0.5625)) - 200
    window.scrollTo(0, offset)
  }

  attemptToRestoreScroll(fromMount = false) {
    const { innerHeight, history, routerState, isModalComponent } = this.props
    let scrollTopValue = null
    if (!routerState.didComeFromSeeMoreCommentsLink && !this.props.ignoresScrollPosition) {
      if (fromMount && !isModalComponent) {
        window.scrollTo(0, 0)
        return false
      }

      this.saveScroll = true

      let sessionScrollLocation = null
      if (this.props.scrollSessionKey) {
        const sessionStorageKey = SESSION_KEYS.scrollLocationKey(this.props.scrollSessionKey)
        sessionScrollLocation = parseInt(Session.getItem(sessionStorageKey), 10)
      }

      if (sessionScrollLocation !== null) {
        scrollTopValue = sessionScrollLocation
      } else if (history[this.state.locationKey]) {
        const historyObj = history[this.state.locationKey]
        scrollTopValue = historyObj.scrollTop
      }
    } else if (routerState.didComeFromSeeMoreCommentsLink) {
      this.saveScroll = true
      scrollTopValue = document.body.scrollHeight - innerHeight
    }

    if (scrollTopValue) {
      requestAnimationFrame(() => {
        if (!this.saveScroll) {
          return
        }

        if (this.scrollContainer) {
          this.scrollContainer.scrollTop = scrollTopValue
        } else if (typeof window !== 'undefined') {
          window.scrollTo(0, scrollTopValue)
        }
      })
      return true
    }
    return false
  }

  loadPage(rel, scrolled = false) {
    const { deviceSize, dispatch, result, stream } = this.props
    const { action } = this.state
    const { meta } = action
    if (scrolled && meta && meta.resultKey && meta.updateKey) {
      // WTF?: Not sure why but when at `/notifications` is in mobile we have to
      // let this pass otherwise scrolling doesn't work. [#119054249]
      if (deviceSize !== 'mobile' && !/notifications/.test(meta.updateKey)) {
        return
      }
    }
    const { pagination } = result
    if (!action.payload.endpoint || !pagination[rel] ||
        parseInt(pagination.totalPagesRemaining, 10) === 0 || !action ||
        (stream.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS &&
         _.get(stream, 'payload.serverResponse.status', 0) === 204)) { return }
    if (runningFetches[pagination[rel]]) { return }
    this.setState({ hidePaginator: false })
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
    // this is used for updating the postId on a comment
    // so that the post exsists in the store after load
    if (action.payload.postIdOrToken) {
      infiniteAction.payload.postIdOrToken = action.payload.postIdOrToken
    }
    dispatch(infiniteAction)
  }

  renderError() {
    const { action } = this.props
    const { meta } = action
    return (
      <section className="StreamContainer hasErrored">
        {meta && meta.renderStream && meta.renderStream.asError ?
          meta.renderStream.asError :
          <ErrorState4xx />
        }
      </section>
    )
  }

  renderLoading() {
    const { className } = this.props
    return (
      <section className={classNames('StreamContainer isBusy', className)} >
        <div className="StreamBusyIndicator">
          <ElloMark />
        </div>
      </section>
    )
  }

  renderZeroState() {
    const { action } = this.props
    if (!action) { return null }
    const { meta } = action
    return (
      <section className="StreamContainer">
        {meta && meta.renderStream && meta.renderStream.asZero ?
          meta.renderStream.asZero :
          null
        }
      </section>
    )
  }

  render() {
    const { className, columnCount, initModel, isGridMode, json,
      paginatorText, renderObj, result, stream } = this.props
    const { action, hidePaginator } = this.state
    if (!action) { return null }
    const model = findModel(json, initModel)
    if (model) {
      renderObj.data.push(model)
    } else if (!renderObj.data.length) {
      switch (stream.type) {
        case ACTION_TYPES.LOAD_STREAM_SUCCESS:
          return this.renderZeroState()
        case ACTION_TYPES.LOAD_STREAM_REQUEST:
          return this.renderLoading()
        case ACTION_TYPES.LOAD_STREAM_FAILURE:
          if (stream.error) {
            return this.renderError()
          }
          return null
        default:
          return null
      }
    }
    const { meta } = action
    const renderMethod = isGridMode ? 'asGrid' : 'asList'
    const pagination = result.pagination
    return (
      <section className={classNames('StreamContainer', className)}>
        {meta.renderStream[renderMethod](renderObj, columnCount)}
        {this.props.children}
        <Paginator
          hasShowMoreButton={
            typeof meta.resultKey !== 'undefined' && typeof meta.updateKey !== 'undefined'
          }
          isHidden={hidePaginator}
          loadNextPage={this.onLoadNextPage}
          messageText={paginatorText}
          totalPages={parseInt(pagination.totalPages, 10)}
          totalPagesRemaining={parseInt(pagination.totalPagesRemaining, 10)}
        />
      </section>
    )
  }
}

export default connect(makeMapStateToProps, null, null, { withRef: true })(StreamContainer)

