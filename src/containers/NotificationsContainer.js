import React, { Component, PropTypes } from 'react'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { GUI, LOAD_STREAM_REQUEST, LOAD_STREAM_SUCCESS } from '../constants/action_types'
import { trackEvent } from '../actions/analytics'
import { setLastAnnouncementSeen, toggleNotifications } from '../actions/gui'
import { loadNotifications, markAnnouncementRead } from '../actions/notifications'
import { selectActiveNotificationScrollPosition, selectActiveNotificationsType } from '../selectors/gui'
import {
    selectAnnouncementBody,
    selectAnnouncementCTACaption,
    selectAnnouncementCTAHref,
    selectAnnouncementId,
    selectAnnouncementImage,
    selectAnnouncementIsEmpty,
    selectAnnouncementTitle,
} from '../selectors/notifications'
import { selectPropsPathname } from '../selectors/routing'
import { selectStreamType } from '../selectors/stream'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../components/notifications/NotificationIcons'
import { AnnouncementNotification } from '../components/notifications/NotificationRenderables'
import { Paginator } from '../components/streams/Paginator'
import { TabListButtons, TabListLinks } from '../components/tabs/TabList'
import { MainView } from '../components/views/MainView'
import StreamContainer from '../containers/StreamContainer'

function mapStateToProps(state, props) {
  const activeTabType = props.isModal ? selectActiveNotificationsType(state) : get(props, 'params.type', 'all')
  return {
    activeTabType,
    announcementBody: selectAnnouncementBody(state),
    announcementCTACaption: selectAnnouncementCTACaption(state),
    announcementCTAHref: selectAnnouncementCTAHref(state),
    announcementId: selectAnnouncementId(state),
    announcementImage: selectAnnouncementImage(state),
    announcementIsEmpty: selectAnnouncementIsEmpty(state),
    announcementTitle: selectAnnouncementTitle(state),
    notificationScrollPosition: selectActiveNotificationScrollPosition(state),
    pathname: selectPropsPathname(state, props),
    streamAction: loadNotifications({ category: activeTabType }),
    streamType: selectStreamType(state),
  }
}

class NotificationsContainer extends Component {
  static propTypes = {
    activeTabType: PropTypes.string.isRequired,
    announcementBody: PropTypes.string,
    announcementCTAHref: PropTypes.string,
    announcementCTACaption: PropTypes.string,
    announcementId: PropTypes.string,
    announcementImage: PropTypes.string,
    announcementIsEmpty: PropTypes.bool.isRequired,
    announcementTitle: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isModal: PropTypes.bool,
    notificationScrollPosition: PropTypes.number.isRequired,
    pathname: PropTypes.string,
    streamAction: PropTypes.object,
    streamType: PropTypes.string,
  }

  static defaultProps = {
    activeTabType: 'all',
    announcementId: '',
    announcementBody: '',
    announcementCTACaption: null,
    announcementCTAHref: null,
    announcementImage: null,
    announcementTitle: '',
    isModal: false,
    pathname: null,
    streamAction: null,
    streamType: null,
    type: 'all',
  }

  static childContextTypes = {
    onClickAnnouncementNotification: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickAnnouncementNotification: this.onClickAnnouncementNotification,
    }
  }

  componentWillMount() {
    this.state = { isReloading: false }
  }

  componentDidMount() {
    if (this.props.isModal) {
      document.addEventListener('click', this.onClickDocument)
      document.addEventListener('touchstart', this.onClickDocument)
    }
    const { announcementId, announcementIsEmpty, dispatch } = this.props
    if (!announcementIsEmpty) {
      const { announcementBody, announcementTitle } = this.props
      const trackTitle = announcementTitle || announcementBody
      const trackProps = { name: trackTitle, announcement: announcementId }
      dispatch(trackEvent('announcement_viewed', trackProps))
    }
    if (announcementId && announcementId.length) {
      dispatch(setLastAnnouncementSeen({ id: announcementId }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamType === LOAD_STREAM_SUCCESS) {
      this.setState({ isReloading: false })
    }
  }

  shouldComponentUpdate(nextProps) {
    return ['activeTabType', 'announcementIsEmpty', 'pathname'].some(prop =>
      nextProps[prop] !== this.props[prop],
    )
  }

  componentDidUpdate(prevProps) {
    const { activeTabType, notificationScrollPosition, streamType } = this.props
    if (this.scrollContainer && prevProps.activeTabType === activeTabType &&
        (streamType === LOAD_STREAM_SUCCESS || streamType === LOAD_STREAM_REQUEST)) {
      this.scrollContainer.scrollTop = notificationScrollPosition
    }
  }

  componentWillUnmount() {
    if (this.props.isModal) {
      document.removeEventListener('click', this.onClickDocument)
      document.removeEventListener('touchstart', this.onClickDocument)
    }
  }

  onClickAnnouncementNotification = (e) => {
    const { announcementBody, announcementTitle, announcementId, dispatch } = this.props
    const el = e.target.tagName === 'IMG' ? e.target.parentNode : e.target
    const trackType = el.classList.contains('js-ANCTA') ? 'clicked' : 'closed'
    const trackTitle = announcementTitle || announcementBody
    const trackProps = { name: trackTitle, announcement: announcementId }
    const trackAction = trackEvent(`announcement_${trackType}`, trackProps)
    if (trackType === 'closed') {
      dispatch(markAnnouncementRead())
    }
    dispatch(trackAction)
  }

  onClickDocument = (e) => {
    if (typeof e.target.closest === 'function' && e.target.closest('.NotificationsContainer')) { return }
    const { dispatch } = this.props
    dispatch(toggleNotifications({ isActive: false }))
  }

  onClickTab = ({ type }) => {
    const { activeTabType, dispatch } = this.props
    if (activeTabType === type) {
      scrollTo(0, 0, { el: this.scrollContainer })
      this.setState({ isReloading: true })
    } else {
      dispatch({
        type: GUI.NOTIFICATIONS_TAB,
        payload: { activeTabType: type },
      })
    }
  }

  onMouseOver = () => {
    document.body.classList.add('isNotificationsScrolling')
  }

  onMouseOut = () => {
    document.body.classList.remove('isNotificationsScrolling')
  }

  render() {
    const {
      activeTabType,
      announcementBody,
      announcementCTACaption,
      announcementCTAHref,
      announcementImage,
      announcementIsEmpty,
      announcementTitle,
      isModal,
      pathname,
      streamAction,
    } = this.props
    const { isReloading } = this.state
    const tabs = [
      { to: '/notifications', type: 'all', children: 'All' },
      { to: '/notifications/comments', type: 'comments', children: <BubbleIcon /> },
      { to: '/notifications/mentions', type: 'mentions', children: '@' },
      { to: '/notifications/loves', type: 'loves', children: <HeartIcon /> },
      { to: '/notifications/reposts', type: 'reposts', children: <RepostIcon /> },
      { to: '/notifications/relationships', type: 'relationships', children: <RelationshipIcon /> },
    ]
    return isModal ?
      (
        <div
          className="NotificationsContainer"
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          <TabListButtons
            activeType={activeTabType}
            className="IconTabList NotificationsContainerTabs"
            onTabClick={this.onClickTab}
            tabClasses="IconTab"
            tabs={tabs}
          />
          <div
            className="Scrollable"
            ref={(comp) => { this.scrollContainer = comp }}
          >
            {
              isReloading ?
                <Paginator
                  className="NotificationReload"
                  isHidden={false}
                /> :
                null
            }
            { !announcementIsEmpty &&
              <AnnouncementNotification
                body={announcementBody}
                ctaCaption={announcementCTACaption}
                ctaHref={announcementCTAHref}
                src={announcementImage}
                title={announcementTitle}
              />
            }
            <StreamContainer
              action={streamAction}
              className="isFullWidth"
              isModalComponent
              key={`notificationView_${activeTabType}_${isReloading}`}
              scrollContainer={this.scrollContainer}
            />
          </div>
        </div>
      ) :
      (
        <MainView className="Notifications">
          <TabListLinks
            activePath={pathname}
            className="IconTabList NotificationsContainerTabs"
            onTabClick={this.onClickTab}
            tabClasses="IconTab"
            tabs={tabs}
          />
          {
            isReloading ?
              <Paginator
                className="NotificationReload"
                isHidden={false}
              /> :
              null
          }
          { !announcementIsEmpty &&
            <AnnouncementNotification
              body={announcementBody}
              ctaCaption={announcementCTACaption}
              ctaHref={announcementCTAHref}
              src={announcementImage}
              title={announcementTitle}
            />
          }
          <StreamContainer
            action={streamAction}
            className="isFullWidth"
            key={`notificationView_${activeTabType}`}
            scrollSessionKey={`notifications_${activeTabType}`}
          />
        </MainView>
      )
  }
}

export default connect(mapStateToProps)(NotificationsContainer)

