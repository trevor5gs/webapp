import React from 'react'
import FilterBar from '../navigation/FilterBar'
import StreamComponent from '../streams/StreamComponent'
import * as DiscoverActions from '../../actions/discover'

class DiscoverView extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.refs.streamComponent) {
      const action = DiscoverActions.loadDiscoverUsers(nextProps.params.type)
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
    }
  }

  render() {
    const links = []
    links.push({ to: '/discover', children: 'Recommended' })
    links.push({ to: '/discover/trending', children: 'Trending' })
    links.push({ to: '/discover/recent', children: 'Recent' })
    return (
      <div className="DiscoverView Panel">
        <FilterBar type="text" links={links} />
        <StreamComponent ref="streamComponent" action={DiscoverActions.loadDiscoverUsers(this.props.params.type)} />
      </div>
    )
  }
}

DiscoverView.propTypes = {
  params: React.PropTypes.shape({
    type: React.PropTypes.string,
  }),
}

DiscoverView.preRender = (store, routerState) => {
  return store.dispatch(DiscoverActions.loadDiscoverUsers(routerState.params.type))
}

export default DiscoverView

