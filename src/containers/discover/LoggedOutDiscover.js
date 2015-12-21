import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SIGNED_OUT_PROMOTIONS } from '../../constants/promotion_types'
import { loadDiscoverUsers } from '../../actions/discover'
import { trackEvent } from '../../actions/tracking'
import Banderole from '../../components/assets/Banderole'
import FilterBar from '../../components/filters/FilterBar'
import StreamComponent from '../../components/streams/StreamComponent'

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
    const links = []
    links.push({ to: '/explore', children: 'Recommended' })
    links.push({ to: '/explore/trending', children: 'Trending' })
    links.push({ to: '/explore/recent', children: 'Recent' })
    const type = this.props.params.type || 'recommended'
    return (
      <section className="LoggedOutDiscover Panel" key={`discover_${type}`}>
        <Banderole
          creditsClickAction={ ::this.creditsTrackingEvent }
          userlist={ SIGNED_OUT_PROMOTIONS }
        />
        <FilterBar type="text" links={links} />
        <StreamComponent ref="streamComponent" action={loadDiscoverUsers(type)} />
      </section>
    )
  }
}

LoggedOutDiscover.preRender = (store, routerState) => {
  return store.dispatch(loadDiscoverUsers(routerState.params.type || 'recommended'))
}

export default connect()(LoggedOutDiscover)

