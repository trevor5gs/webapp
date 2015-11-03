import React from 'react'
import FilterBar from '../navigation/FilterBar'
import StreamComponent from '../streams/StreamComponent'
import * as NotificationActions from '../../actions/notifications'
import { BubbleIcon, HeartIcon, RepostIcon } from '../iconography/Icons'

class NotificationsView extends React.Component {
  render() {
    const { category } = this.props.params
    const params = {}
    if (category) {
      params.category = category
    }
    const links = []
    links.push({ to: '/notifications', children: 'All' })
    links.push({ to: '/notifications/comments', children: <BubbleIcon /> })
    links.push({ to: '/notifications/loves', children: <HeartIcon /> })
    links.push({ to: '/notifications/mentions', children: '@' })
    links.push({ to: '/notifications/reposts', children: <RepostIcon /> })
    links.push({ to: '/notifications/relationships', children: 'Relationships' })
    return (
      <div className="NotificationsView Panel">
        <FilterBar type="icon" links={links} />
        <StreamComponent action={NotificationActions.loadNotifications(params)} />
      </div>
    )
  }
}

NotificationsView.propTypes = {
  params: React.PropTypes.shape({
    category: React.PropTypes.string,
  }),
}

export default NotificationsView

