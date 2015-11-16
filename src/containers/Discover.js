import React from 'react'
import FilterBar from '../components/navigation/FilterBar'
import StreamComponent from '../components/streams/StreamComponent'
import { loadDiscoverUsers } from '../actions/discover'

class Discover extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.refs.streamComponent) {
      const action = loadDiscoverUsers(nextProps.params.type)
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
    }
  }

  render() {
    const links = []
    links.push({ to: '/', children: 'Recommended' })
    links.push({ to: '/discover/trending', children: 'Trending' })
    links.push({ to: '/discover/recent', children: 'Recent' })
    const type = this.props.params.type
    return (
      <section className="Discover Panel">
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

