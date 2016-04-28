import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { debounce, get } from 'lodash'
import { hideSoftKeyboard } from '../../vendor/jello'
import { LOGGED_IN_PROMOTIONS } from '../../constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../constants/promotions/logged_out'
import { updateQueryParams } from '../../helpers/uri_helper'
import * as SearchActions from '../../actions/search'
import { trackEvent } from '../../actions/tracking'
import Promotion from '../../components/assets/Promotion'
import SearchControl from '../../components/forms/SearchControl'
import StreamComponent from '../../components/streams/StreamComponent'
import { TabListButtons } from '../../components/tabs/TabList'

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
  }

  static preRender = (store, routerState) => {
    const term = get(routerState, 'location.query.terms', '')
    const type = get(routerState, 'location.query.type', 'posts')
    const action = type === 'users' ? SearchActions.searchForUsers : SearchActions.searchForPosts
    return store.dispatch(action(term))
  }

  componentWillMount() {
    this.state = {
      terms: this.props.location.query.terms || '',
      type: this.props.location.query.type || 'posts',
    }
    this.search = debounce(this.search, 666)
    this.updateLocation = debounce(this.updateLocation, 666)
  }

  componentDidMount() {
    this.updateLocation({ ...this.state })
  }

  onChangeControl = (vo) => {
    // order is important here, need to update
    // location so fetch has the correct path
    this.updateLocation(vo)
    this.setState(vo)
    this.search()
  }

  onSubmit = (e) => {
    e.preventDefault()
    hideSoftKeyboard()
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('banderole-credits-clicked'))
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

  updateLocation(valueObject) {
    const { dispatch, location } = this.props
    const vo = valueObject
    if (typeof vo.terms === 'string' && vo.terms.length < 2) {
      vo.terms = null
    }
    if (typeof vo.type === 'string' && vo.type === 'posts') {
      vo.type = null
    }
    const uri = location.pathname + updateQueryParams(vo)
    dispatch(replace(uri))
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

  render() {
    const { isLoggedIn } = this.props
    const { terms, type } = this.state
    const tabs = [
      { type: 'posts', children: 'Posts' },
      { type: 'users', children: 'People' },
    ]
    return (
      <section className="Search Panel">
        <Promotion
          creditsClickAction={ this.onClickTrackCredits }
          isLoggedIn={ isLoggedIn }
          userlist={ isLoggedIn ? LOGGED_IN_PROMOTIONS : LOGGED_OUT_PROMOTIONS }
        />
        <form className="SearchBar" onSubmit={ this.onSubmit }>
          <SearchControl
            onChange={ this.onChangeControl }
            text={ terms }
          />
          <TabListButtons
            activeType={ type }
            className="SearchTabList"
            onTabClick={ this.onChangeControl }
            tabClasses="LabelTab SearchLabelTab"
            tabs={ tabs }
          />
        </form>
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

