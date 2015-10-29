import React from 'react'
import { Link } from 'react-router'
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
    return (
      <div className="NotificationsView Panel">
        <Link to="/notifications">All</Link>
        <Link to="/notifications/comments"><BubbleIcon /></Link>
        <Link to="/notifications/loves"><HeartIcon /></Link>
        <Link to="/notifications/mentions">@</Link>
        <Link to="/notifications/reposts"><RepostIcon /></Link>
        <Link to="/notifications/relationships">Relationships</Link>
        <StreamComponent key={category} action={NotificationActions.loadNotifications(params)} />
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

