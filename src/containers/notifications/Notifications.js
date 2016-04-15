import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { loadNotifications } from '../../actions/notifications'
import StreamComponent from '../../components/streams/StreamComponent'
import { LOAD_STREAM_SUCCESS } from '../../constants/action_types'
import { SESSION_KEYS } from '../../constants/gui_types'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../../components/notifications/NotificationIcons'
import { TabListLinks } from '../../components/tabs/TabList'
import { scrollToTop } from '../../vendor/scrollTop'
import { Paginator } from '../../components/streams/Paginator'
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
    this.saveCategory()
    this.state = { isReloading: false }
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
      scrollToTop()
      this.setState({ isReloading: true })
    }
    if (this.refs.streamComponent) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(
        loadNotifications({ category: type })
      )
    }
    this.setState({ activeTabType: type })
  }

  saveCategory() {
    const { category } = this.props.params
    if (category) {
      Session.setItem(SESSION_KEYS.NOTIFICATIONS_FILTER, category)
    } else {
      Session.removeItem(SESSION_KEYS.NOTIFICATIONS_FILTER)
    }
  }

  render() {
    const { pathname } = this.props
    const { category } = this.props.params
    const { isReloading } = this.state
    const params = {}
    if (category) {
      params.category = category
    }
    const tabs = [
      { to: '/notifications', type: 'all', children: 'All' },
      { to: '/notifications/comments', type: 'comments', children: <BubbleIcon /> },
      { to: '/notifications/mentions', type: 'mentions', children: '@' },
      { to: '/notifications/loves', type: 'loves', children: <HeartIcon /> },
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
          action={ loadNotifications(params) }
          className="asFullWidth"
          key={ `notificationPanel_${params.category}` }
          scrollSessionKey={ `notifications_${category || 'all'}` }
          ref="streamComponent"
        />
      </section>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    pathname: ownProps.location.pathname,
    streamType: _.get(state, 'stream.type'),
  }
}

export default connect(mapStateToProps)(Notifications)

