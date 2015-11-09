import React from 'react'
import StreamComponent from '../streams/StreamComponent'
import * as SearchActions from '../../actions/search'
import SearchControl from '../forms/SearchControl'
import { debounce } from '../base/lib'
import classNames from 'classnames'

class SearchView extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { terms, type } = this.props
    this.state = {
      terms: terms || '',
      type: type || 'posts',
    }
  }

  componentWillMount() {
    this.search = debounce(this.search, 500)
  }

  search() {
    const { terms, type } = this.state
    let action = null
    if (terms.length > 1) {
      if (type === 'users') {
        action = SearchActions.searchForUsers(terms)
      } else {
        action = SearchActions.searchForPosts(terms)
      }
    }
    if (action) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
    }
  }

  handleControlChange(vo) {
    this.setState(vo)
    this.search()
  }

  render() {
    const { type } = this.state
    return (
      <div className="SearchView Panel">
        <div className="SearchBar">
          <SearchControl text="" controlWasChanged={this.handleControlChange.bind(this)} />
          <button className={classNames('SearchFilter', { active: type === 'posts' })} onClick={() => { this.handleControlChange({ type: 'posts' }) }} >
            Posts
          </button>
          <button className={classNames('SearchFilter', { active: type === 'users' })} onClick={() => { this.handleControlChange({ type: 'users' }) }} >
            People
          </button>
        </div>
        <StreamComponent ref="streamComponent" />
      </div>
    )
  }
}

SearchView.propTypes = {
  terms: React.PropTypes.string,
  type: React.PropTypes.string,
}

export default SearchView

