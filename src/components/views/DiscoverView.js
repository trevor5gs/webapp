import React from 'react'
import FilterBar from '../navigation/FilterBar'
import StreamComponent from '../streams/StreamComponent'
import * as DiscoverActions from '../../actions/discover'

class DiscoverView extends React.Component {
  render() {
    const links = []
    links.push({ to: '/discover', children: 'Featured' })
    links.push({ to: '/discover/random', children: 'Random' })
    links.push({ to: '/discover/related', children: 'Related' })
    return (
      <div className="DiscoverView Panel">
        <FilterBar type="text" links={links} />
        <StreamComponent action={DiscoverActions.loadDiscoverUsers(this.props.params.type)} />
      </div>
    )
  }
}

DiscoverView.propTypes = {
  params: React.PropTypes.shape({
    type: React.PropTypes.string,
  }),
}

export default DiscoverView

