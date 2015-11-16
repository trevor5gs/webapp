import React from 'react'
import classNames from 'classnames'
import App from './App'
import StreamComponent from '../components/streams/StreamComponent'
import SearchControl from '../components/forms/SearchControl'
import { debounce } from '../components/base/lib'
import * as SearchActions from '../actions/search'

class Search extends React.Component {
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
      <App>
        <section className="Search Panel">
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
        </section>
      </App>
    )
  }
}

Search.propTypes = {
  terms: React.PropTypes.string,
  type: React.PropTypes.string,
}

export default Search

