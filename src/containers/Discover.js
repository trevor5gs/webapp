import React from 'react'
import FilterBar from '../components/filters/FilterBar'
import StreamComponent from '../components/streams/StreamComponent'
import { loadDiscoverUsers } from '../actions/discover'

class Discover extends React.Component {

  render() {
    const links = []
    links.push({ to: '/discover', children: 'Recommended' })
    links.push({ to: '/discover/trending', children: 'Trending' })
    links.push({ to: '/discover/recent', children: 'Recent' })
    const type = this.props.params.type
    return (
      <section className="Discover Panel" key={`discover_${type}`}>
        <FilterBar type="text" links={links} />
        <StreamComponent ref="streamComponent" action={loadDiscoverUsers(type)} />
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

