import React from 'react'
import FilterBar from '../components/filters/FilterBar'
import StreamComponent from '../components/streams/StreamComponent'
import { loadDiscoverUsers } from '../actions/discover'

class LoggedOutDiscover extends React.Component {

  render() {
    const links = []
    links.push({ to: '/', children: 'Recommended' })
    links.push({ to: '/trending', children: 'Trending' })
    links.push({ to: '/recent', children: 'Recent' })
    // links.push({ to: '/discover/communities', children: 'Communities' })
    // links.push({ to: '/discover/featured-users', children: 'Featured Users' })
    const pathArr = this.props.location.pathname.split('/')
    const type = pathArr[1].length ? pathArr[1] : 'recommended'
    return (
      <section className="LoggedOutDiscover Panel" key={`discover_${type}`}>
        <FilterBar type="text" links={links} />
        <StreamComponent ref="streamComponent" action={loadDiscoverUsers(type)} />
      </section>
    )
  }
}

LoggedOutDiscover.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
  }),
}

LoggedOutDiscover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type))
}

export default LoggedOutDiscover

