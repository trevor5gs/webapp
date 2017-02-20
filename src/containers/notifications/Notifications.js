import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { scrollTo } from '../../lib/jello'
import Session from '../../lib/session'
import { selectPropsPathname } from '../../selectors/routing'
import {
    selectAnnouncementBody,
    selectAnnouncementCTACaption,
    selectAnnouncementCTAHref,
    selectAnnouncementId,
    selectAnnouncementImage,
    selectAnnouncementIsEmpty,
    selectAnnouncementTitle,
} from '../../selectors/notifications'
import { selectStreamType } from '../../selectors/stream'
import { trackEvent } from '../../actions/analytics'
import { loadNotifications, markAnnouncementRead } from '../../actions/notifications'
import StreamContainer from '../../containers/StreamContainer'
import { LOAD_STREAM_SUCCESS } from '../../constants/action_types'
import { SESSION_KEYS } from '../../constants/application_types'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListLinks } from '../../components/tabs/TabList'
import { Paginator } from '../../components/streams/Paginator'
import { MainView } from '../../components/views/MainView'
import { AnnouncementNotification } from '../../components/notifications/NotificationRenderables'

function mapStateToProps(state, props) {
  const type = get(props, 'params.type', 'all')
  return {
    announcementBody: selectAnnouncementBody(state),
    announcementCTACaption: selectAnnouncementCTACaption(state),
    announcementCTAHref: selectAnnouncementCTAHref(state),
    announcementId: selectAnnouncementId(state),
    announcementImage: selectAnnouncementImage(state),
    announcementIsEmpty: selectAnnouncementIsEmpty(state),
    announcementTitle: selectAnnouncementTitle(state),
    pathname: selectPropsPathname(state, props),
    streamAction: loadNotifications({ category: type }),
    streamType: selectStreamType(state),
    type,
  }
}

class Notifications extends Component {

  static propTypes = {
    announcementBody: PropTypes.string,
    announcementCTAHref: PropTypes.string,
    announcementCTACaption: PropTypes.string,
    announcementId: PropTypes.string,
    announcementImage: PropTypes.string,
    announcementIsEmpty: PropTypes.bool.isRequired,
    announcementTitle: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    pathname: PropTypes.string,
    streamAction: PropTypes.object,
    type: PropTypes.string,
  }

  static defaultProps = {
    announcementId: '',
    announcementBody: '',
    announcementCTACaption: null,
    announcementCTAHref: null,
    announcementImage: null,
    announcementTitle: '',
    pathname: null,
    streamAction: null,
    type: 'all',
  }

  static preRender = (store, routerState) =>
    store.dispatch(loadNotifications({ category: routerState.params.type }))

  static childContextTypes = {
    onClickAnnouncementNotification: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickAnnouncementNotification: this.onClickAnnouncementNotification,
    }
  }

  componentWillMount() {
    this.saveCategory()
    this.state = { isReloading: false }
  }

  componentDidMount() {
    if (this.props.announcementIsEmpty) {
      const { announcementBody, announcementTitle, announcementId, dispatch } = this.props
      const trackName = announcementTitle || announcementBody
      const trackProps = { name: trackName, announcement: announcementId }
      dispatch(trackEvent('announcement_viewed', trackProps))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamType === LOAD_STREAM_SUCCESS) {
      this.setState({ isReloading: false })
    }
  }

  componentDidUpdate() {
    this.saveCategory()
  }

  onClickTab = ({ type }) => {
    if (this.state.activeTabType === type) {
      scrollTo(0, 0)
      this.setState({ isReloading: true })
    }
    this.setState({ activeTabType: type })
  }

  onClickAnnouncementNotification = (e) => {
    const { announcementBody, announcementTitle, announcementId, dispatch } = this.props
    const el = e.target.tagName === 'IMG' ? e.target.parentNode : e.target
    const trackType = el.classList.contains('js-ANCTA') ? 'clicked' : 'closed'
    const trackProps = { name: announcementTitle || announcementBody, announcement: announcementId }
    const trackAction = trackEvent(`announcement_${trackType}`, trackProps)
    if (trackType === 'closed') {
      dispatch(markAnnouncementRead())
    }
    dispatch(trackAction)
  }

  saveCategory() {
    const { type } = this.props
    if (type) {
      Session.setItem(SESSION_KEYS.NOTIFICATIONS_FILTER, type)
    } else {
      Session.removeItem(SESSION_KEYS.NOTIFICATIONS_FILTER)
    }
  }

  render() {
    const {
      announcementBody,
      announcementCTACaption,
      announcementCTAHref,
      announcementImage,
      announcementIsEmpty,
      announcementTitle,
      pathname,
      streamAction,
      type,
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
    return (
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
        { announcementIsEmpty &&
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
          key={`notificationView_${type}`}
          scrollSessionKey={`notifications_${type}`}
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(Notifications)

