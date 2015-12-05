import React, { Component, PropTypes } from 'react'
import { BANDEROLES } from '../../constants/gui_types'
import { loadDiscoverUsers } from '../../actions/discover'
import Banderole from '../../components/assets/Banderole'
import FilterBar from '../../components/filters/FilterBar'
import StreamComponent from '../../components/streams/StreamComponent'

class LoggedOutDiscover extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }

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
        <Banderole userlist={ BANDEROLES } />
        <FilterBar type="text" links={links} />
        <StreamComponent ref="streamComponent" action={loadDiscoverUsers(type)} />
      </section>
    )
  }
}

LoggedOutDiscover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type))
}

export default LoggedOutDiscover

