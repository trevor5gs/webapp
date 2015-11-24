import React from 'react'
import FilterBar from '../components/filters/FilterBar'
import StreamComponent from '../components/streams/StreamComponent'
import { loadDiscoverUsers, loadCommunities, loadFeaturedUsers } from '../actions/discover'

class Discover extends React.Component {

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

Discover.propTypes = {
  params: React.PropTypes.shape({
    type: React.PropTypes.string,
  }),
}

Discover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type))
}

export default Discover

