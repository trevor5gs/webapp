import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { debounce } from 'lodash'
import { LOGGED_IN_PROMOTIONS } from '../../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../constants/promotions/logged_out'
import * as SearchActions from '../../actions/search'
import { trackEvent } from '../../actions/tracking'
import { updateQueryParams } from '../../components/base/uri_helper'
import Banderole from '../../components/assets/Banderole'
import SearchControl from '../../components/forms/SearchControl'
import StreamComponent from '../../components/streams/StreamComponent'
import TabListButtons from '../../components/tabs/TabListButtons'

class Search extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        terms: PropTypes.string,
        type: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  componentWillMount() {
    this.state = {
      terms: this.props.location.query.terms || '',
      type: this.props.location.query.type || 'posts',
    }
    this.search = debounce(this.search, 300)
    this.updateLocation = debounce(this.updateLocation, 300)
  }

  componentDidMount() {
    this.updateLocation({ ...this.state })
  }

  getAction() {
    const { terms, type } = this.state
    if (terms && terms.length > 1) {
      if (type === 'users') {
        return SearchActions.searchForUsers(terms)
      }
      return SearchActions.searchForPosts(terms)
    }
    return null
  }

  search() {
    const { dispatch, isLoggedIn } = this.props
    const { type } = this.state
    const action = this.getAction()
    if (action) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
      const label = type === 'users' ? 'people' : 'posts'
      const trackStr = `search-logged-${isLoggedIn ? 'in' : 'out'}-${label}`
      dispatch(trackEvent(trackStr))
    }
  }

  updateLocation(valueObject) {
    const { dispatch } = this.props
    const vo = valueObject
    if (typeof vo.terms === 'string' && vo.terms.length < 2) {
      vo.terms = null
    }
    if (typeof vo.type === 'string' && vo.type === 'posts') {
      vo.type = null
    }
    if (typeof document !== 'undefined') {
      const uri = document.location.pathname + updateQueryParams(vo)
      dispatch(routeActions.replace(uri))
    }
  }

  handleControlChange = (vo) => {
    // order is important here, need to update
    // location so fetch has the correct path
    this.updateLocation(vo)
    this.setState(vo)
    this.search()
  };

  creditsTrackingEvent = () => {
    const { dispatch } = this.props
    dispatch(trackEvent(`banderole-credits-clicked`))
  };

  render() {
    const { isLoggedIn } = this.props
    const { terms, type } = this.state
    const tabs = [
      { type: 'posts', children: 'Posts' },
      { type: 'users', children: 'People' },
    ]
    return (
      <section className="Search Panel">
        <Banderole
          creditsClickAction={ this.creditsTrackingEvent }
          isLoggedIn={ isLoggedIn }
          userlist={ isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS }
        />
        <div className="SearchBar">
          <SearchControl
            onChange={ this.handleControlChange }
            text={ terms }
          />
          <TabListButtons
            activeType={ type }
            className="SearchTabList"
            onTabClick={ this.handleControlChange }
            tabClasses="LabelTab"
            tabs={ tabs }
          />
        </div>
        <StreamComponent ref="streamComponent" action={ this.getAction() } />
      </section>
    )
  }
}


function mapStateToProps(state) {
  return {
    isLoggedIn: state.authentication.isLoggedIn,
  }
}

export default connect(mapStateToProps)(Search)

