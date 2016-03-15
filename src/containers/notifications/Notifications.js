import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadNotifications } from '../../actions/notifications'
import StreamComponent from '../../components/streams/StreamComponent'
import { SESSION_KEYS } from '../../constants/gui_types'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListLinks } from '../../components/tabs/TabList'
import Session from '../../../src/vendor/session'

/* eslint-disable react/prefer-stateless-function */
export class Notifications extends Component {

  static propTypes = {
    pathname: PropTypes.string,
    params: PropTypes.shape({
      category: PropTypes.string,
    }),
  }

  static preRender = (store, routerState) => {
    const { category } = routerState.params
    const params = {}
    if (category) {
      params.category = category
    }
    return store.dispatch(loadNotifications(params))
  }

  componentWillMount() {
    const { category } = this.props.params
    if (category) {
      Session.setItem(SESSION_KEYS.NOTIFICATIONS_FILTER, category)
    } else {
      Session.removeItem(SESSION_KEYS.NOTIFICATIONS_FILTER)
    }
  }

  onClickTab = ({ type }) => {
    if (this.refs.streamComponent) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(
        loadNotifications({ category: type })
      )
    }
  }

  render() {
    const { pathname } = this.props
    const { category } = this.props.params
    const params = {}
    if (category) {
      params.category = category
    }
    const tabs = [
      { to: '/notifications', type: 'all', children: 'All' },
      { to: '/notifications/comments', type: 'comments', children: <BubbleIcon /> },
      { to: '/notifications/loves', type: 'loves', children: <HeartIcon /> },
      { to: '/notifications/mentions', type: 'mentions', children: '@' },
      { to: '/notifications/reposts', type: 'reposts', children: <RepostIcon /> },
      { to: '/notifications/relationships', type: 'relationships', children: <RelationshipIcon /> },
    ]
    return (
      <section className="Notifications Panel">
        <TabListLinks
          activePath={ pathname }
          className="IconTabList NotificationsContainerTabs"
          onTabClick={ this.onClickTab }
          tabClasses="IconTab"
          tabs={ tabs }
        />
        <StreamComponent
          action={ loadNotifications(params) }
          className="asFullWidth"
          key={ `notificationPanel_${params.category}` }
          historyLocationOverride={ `notifications_${pathname}` }
          ref="streamComponent"
        />
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    pathname: ownProps.location.pathname,
  }
}

export default connect(mapStateToProps)(Notifications)

