import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadDiscoverUsers, loadCommunities, loadFeaturedUsers } from '../../actions/discover'
import StreamComponent from '../../components/streams/StreamComponent'
import TabListLinks from '../../components/tabs/TabListLinks'

class Discover extends Component {

  render() {
    const { params, pathname } = this.props
    const type = params.type || 'recommended'
    let action = loadDiscoverUsers(type)
    if (type === 'communities') {
      action = loadCommunities()
    } else if (type === 'featured-users') {
      action = loadFeaturedUsers()
    }
    const tabs = [
      { to: '/discover', children: 'Recommended' },
      { to: '/discover/trending', children: 'Trending' },
      { to: '/discover/recent', children: 'Recent' },
      // { to: '/discover/communities', children: 'Communities' },
      // { to: '/discover/featured-users', children: 'Featured Users' },
    ]
    return (
      <section className="Discover Panel" key={`discover_${type}`}>
        <TabListLinks
          activePath={pathname}
          className="LabelTabList"
          tabClasses="LabelTab"
          tabs={tabs}
        />
        <StreamComponent action={action} ref="streamComponent" />
      </section>
    )
  }
}

Discover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))
}

Discover.propTypes = {
  pathname: PropTypes.string.isRequired,
  params: PropTypes.shape({
    type: PropTypes.string,
  }),
}

function mapStateToProps(state) {
  return {
    pathname: state.router.path,
  }
}

export default connect(mapStateToProps)(Discover)

