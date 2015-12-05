import React, { Component, PropTypes } from 'react'
import { loadDiscoverUsers, loadCommunities, loadFeaturedUsers } from '../../actions/discover'
import FilterBar from '../../components/filters/FilterBar'
import StreamComponent from '../../components/streams/StreamComponent'

class Discover extends Component {
  static propTypes = {
    params: PropTypes.shape({
      type: PropTypes.string,
    }),
  }

  render() {
    const links = []
    links.push({ to: '/discover', children: 'Recommended' })
    links.push({ to: '/discover/trending', children: 'Trending' })
    links.push({ to: '/discover/recent', children: 'Recent' })
    // links.push({ to: '/discover/communities', children: 'Communities' })
    // links.push({ to: '/discover/featured-users', children: 'Featured Users' })
    const type = this.props.params.type || 'recommended'
    let action = loadDiscoverUsers(type)
    if (type === 'communities') {
      action = loadCommunities()
    } else if (type === 'featured-users') {
      action = loadFeaturedUsers()
    }
    return (
      <section className="Discover Panel" key={`discover_${type}`}>
        <FilterBar type="text" links={links} />
        <StreamComponent ref="streamComponent" action={action} />
      </section>
    )
  }
}

Discover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type))
}

export default Discover

