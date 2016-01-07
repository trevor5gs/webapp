import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SIGNED_OUT_PROMOTIONS } from '../../constants/promotion_types'
import { loadDiscoverUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Banderole from '../../components/assets/Banderole'
import StreamComponent from '../../components/streams/StreamComponent'
import TabListLinks from '../../components/tabs/TabListLinks'

class Explore extends Component {

  creditsTrackingEvent() {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  }

  render() {
    const { params, pathname } = this.props
    const type = params.type || 'recommended'
    const tabs = [
      { to: '/explore', children: 'Recommended' },
      { to: '/explore/trending', children: 'Trending' },
      { to: '/explore/recent', children: 'Recent' },
    ]
    return (
      <section className="Explore Panel" key={`discover_${type}`}>
        <Banderole
          creditsClickAction={ ::this.creditsTrackingEvent }
          userlist={ SIGNED_OUT_PROMOTIONS }
        />
        <TabListLinks
          activePath={pathname}
          className="LabelTabList"
          tabClasses="LabelTab"
          tabs={tabs}
        />
        <StreamComponent action={loadDiscoverUsers(type)} ref="streamComponent" />
      </section>
    )
  }
}

Explore.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))
}

Explore.propTypes = {
  dispatch: PropTypes.func.isRequired,
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

export default connect(mapStateToProps)(Explore)

