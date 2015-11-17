import React from 'react'
import FilterBar from '../components/filters/FilterBar'
import StreamComponent from '../components/streams/StreamComponent'
import { BubbleIcon, HeartIcon, RepostIcon } from '../components/posts/PostIcons'
import { loadNotifications } from '../actions/notifications'

class Notifications extends React.Component {
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
      <section className="Notifications Panel">
        <FilterBar type="icon" links={links} />
        <StreamComponent action={loadNotifications(params)} />
      </section>
    )
  }
}

Notifications.propTypes = {
  params: React.PropTypes.shape({
    category: React.PropTypes.string,
  }),
}

Notifications.preRender = (store, routerState) => {
  const { category } = routerState.params
  const params = {}
  if (category) {
    params.category = category
  }
  return store.dispatch(loadNotifications(params))
}

export default Notifications

