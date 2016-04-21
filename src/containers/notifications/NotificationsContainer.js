import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { GUI, LOAD_STREAM_SUCCESS, MODAL } from '../../constants/action_types'
import { connect } from 'react-redux'
import { scrollElToTop } from '../../vendor/scrollTop'
import { loadNotifications } from '../../actions/notifications'
import StreamComponent from '../../components/streams/StreamComponent'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListButtons } from '../../components/tabs/TabList'
import { Paginator } from '../../components/streams/Paginator'

let ticking = false

class NotificationsContainer extends Component {

  static propTypes = {
    activeTabType: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    activeTabType: 'all',
  }

  componentWillMount() {
    this.body = ReactDOM.findDOMNode(document.body)
    this.onScrolled = _.debounce(this.onScrolled, 300)
    this.state = { isReloading: false }
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickDocument)
    this.refs.streamComponent.refs.wrappedInstance.scrollContainer = this.refs.scrollable
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamType === LOAD_STREAM_SUCCESS) {
      this.setState({ isReloading: false })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTabType !== this.props.activeTabType && this.refs.scrollable) {
      this.refs.streamComponent.refs.wrappedInstance.scrollContainer = this.refs.scrollable
      this.refs.scrollable.scrollTop = 0
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickDocument)
  }

  onMouseOver = () => {
    this.body.classList.add('notificationsAreScrolling')
  }

  onMouseOut = () => {
    this.body.classList.remove('notificationsAreScrolling')
  }

  onClickTab = ({ type }) => {
    const { dispatch } = this.props
    if (this.state.activeTabType === type) {
      scrollElToTop(this.refs.scrollable)
      this.setState({ isReloading: true })
    } else {
      dispatch({
        type: GUI.NOTIFICATIONS_TAB,
        payload: { activeTabType: type },
      })
    }
    if (this.refs.streamComponent) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(
        loadNotifications({ category: type })
      )
    }
    this.setState({ activeTabType: type })
  }

  onClickSelf = (e) => {
    e.preventDefault()
    this.ignoreNext = true
    setTimeout(() => { this.ignoreNext = false }, 1)
  }

  onClickDocument = (e) => {
    if (this.ignoreNext) {
      return
    }
    const classList = e.target.classList
    if (classList.contains('TabButton') ||
        classList.contains('RelationshipButton') ||
        classList.contains('StarshipButton')
       ) { return }
    const { dispatch } = this.props
    dispatch({
      type: MODAL.TOGGLE_NOTIFICATIONS,
      payload: { isNotificationsActive: false },
    })
  }

  onScrolled = () => {
    const { scrollable } = this.refs
    if (!scrollable) { return }

    this.refs.streamComponent.refs.wrappedInstance.onScroll()

    const scrollY = Math.ceil(scrollable.scrollTop)
    const scrollHeight = Math.max(scrollable.scrollHeight, scrollable.offsetHeight)
    const scrollBottom = Math.round(scrollHeight - scrollable.offsetHeight)
    if (Math.abs(scrollY - scrollBottom) < 5) {
      this.refs.streamComponent.refs.wrappedInstance.onLoadNextPage()
    }
  }

  onScrollElement = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        this.onScrolled()
        ticking = false
      })
      ticking = true
    }
  }

  render() {
    const { activeTabType } = this.props
    const { isReloading } = this.state
    const tabs = [
      { type: 'all', children: 'All' },
      { type: 'comments', children: <BubbleIcon /> },
      { type: 'mentions', children: '@' },
      { type: 'loves', children: <HeartIcon /> },
      { type: 'reposts', children: <RepostIcon /> },
      { type: 'relationships', children: <RelationshipIcon /> },
    ]
    return (
      <div className="NotificationsContainer"
        onClick={ this.onClickSelf }
        onMouseOver={ this.onMouseOver }
        onMouseOut={ this.onMouseOut }
      >
        <TabListButtons
          activeType={ activeTabType }
          className="IconTabList NotificationsContainerTabs"
          onTabClick={ this.onClickTab }
          tabClasses="IconTab"
          tabs={ tabs }
        />
        <div className="Scrollable" ref="scrollable" onScroll={ this.onScrollElement }>
          {
            isReloading ?
              <Paginator
                className="NotificationReload"
                isHidden={ false }
                totalPages={ 0 }
                totalPagesRemaining={ 0 }
              /> :
              null
          }
          <StreamComponent
            action={ loadNotifications({ category: activeTabType }) }
            className="asFullWidth"
            key={ `notificationPanel_${activeTabType}` }
            ref="streamComponent"
            scrollSessionKey={ `notifications_${activeTabType}` }
            isModalComponent
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeTabType: state.gui.activeNotificationsTabType,
    streamType: _.get(state, 'stream.type'),
  }
}

export default connect(mapStateToProps, null, null, { withRef: true })(NotificationsContainer)

