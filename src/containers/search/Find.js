import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import StreamComponent from '../../components/streams/StreamComponent'
import SearchControl from '../../components/forms/SearchControl'
import debounce from 'lodash.debounce'
import * as SearchActions from '../../actions/search'
import * as ACTION_TYPES from '../../constants/action_types'
import Banderole from '../../components/assets/Banderole'
import { BANDEROLES } from '../../constants/gui_types'

class Find extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = this.props.search
    const terms = props.location.query.terms
    const type = props.location.query.type
    if (terms) {
      this.state.terms = terms
    }
    if (type && (type === 'users' || type === 'posts')) {
      this.state.type = type
    }
  }

  componentWillMount() {
    this.search = debounce(this.search, 300)
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
    const { dispatch } = this.props
    dispatch({
      type: ACTION_TYPES.SEARCH.SAVE,
      payload: this.state,
    })
    const action = this.getAction()
    if (action) {
      this.refs.streamComponent.refs.wrappedInstance.setAction(action)
    }
  }

  handleControlChange(vo) {
    this.setState(vo)
    this.search()
  }

  render() {
    const { terms, type } = this.state
    return (
      <section className="Search Panel">
        <Banderole userlist={ BANDEROLES } />
        <div className="SearchBar">
          <SearchControl text={terms} controlWasChanged={this.handleControlChange.bind(this)} />
          <button className={classNames('SearchFilter', { active: type === 'posts' })} onClick={() => { this.handleControlChange({ type: 'posts' }) }} >
            Posts
          </button>
          <button className={classNames('SearchFilter', { active: type === 'users' })} onClick={() => { this.handleControlChange({ type: 'users' }) }} >
            People
          </button>
        </div>
        <StreamComponent ref="streamComponent" action={this.getAction()} />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    search: state.search,
  }
}

Find.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      terms: React.PropTypes.string,
      type: React.PropTypes.string,
    }).isRequired,
  }).isRequired,
  search: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(Find)

