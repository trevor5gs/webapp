import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SIGNED_OUT_PROMOTIONS } from '../../constants/promotion_types'
import { loadDiscoverUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Banderole from '../../components/assets/Banderole'
import StreamComponent from '../../components/streams/StreamComponent'
import TabListLinks from '../../components/tabs/TabListLinks'

class LoggedOutDiscover extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    params: PropTypes.shape({
      type: PropTypes.string,
    }),
  }

  creditsTrackingEvent() {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  }

  render() {
    const { params, location } = this.props
    const type = params.type || 'recommended'
    const tabs = [
      { to: '/explore', children: 'Recommended' },
      { to: '/explore/trending', children: 'Trending' },
      { to: '/explore/recent', children: 'Recent' },
    ]
    return (
      <section className="LoggedOutDiscover Panel" key={`discover_${type}`}>
        <Banderole
          creditsClickAction={ ::this.creditsTrackingEvent }
          userlist={ SIGNED_OUT_PROMOTIONS }
        />
        <TabListLinks
          activePath={location.pathname}
          className="LabelTabList"
          tabClasses="LabelTab"
          tabs={tabs}
        />
        <StreamComponent action={loadDiscoverUsers(type)} ref="streamComponent" />
      </section>
    )
  }
}

LoggedOutDiscover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))
}

export default connect()(LoggedOutDiscover)

