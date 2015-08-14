import React from 'react'
import { connect } from 'react-redux'
import { loadCommunities, loadAwesomePeople } from '../actions/community_actions'

class StreamView extends React.Component {

  render() {
    console.log('StreamView#render', this.props)

    // this.loadStream(this.props.route.path)
    const { payload, error, meta } = this.props
    if (!payload || !meta) {
      return <div/>
    }
    const { response } = payload
    const { mappingType } = meta
    const json = (response && response[mappingType] && response[mappingType].length) ? response[mappingType] : []
    return (
      <section className='stream-view'>
        { json.length ? this.renderStream(json) : '' }
      </section>
    )
  }

  loadStream(path) {
    console.log(path)
    switch(path) {
      case 'communities':
        this.props.dispatch(loadAwesomePeople())
        break
      case 'awesome-people':
        this.props.dispatch(loadAwesomePeople())
        break
    }
  }

  renderStream(json) {
    return(
      <ul>
        {json.map(function(user) {
          return <li>@{user.username}</li>
          })}
      </ul>
    )
  }
}

// This should be a selector
// @see: https://github.com/faassen/reselect
// function mapStateToProps(state) {
//   return {
//     path: state.payload.path
//   }
// }

// export default connect(mapStateToProps)(StreamView)

// This is bad... https://github.com/gaearon/react-redux#inject-dispatch-and-every-field-in-the-global-state-slow
export default connect(state => state)(StreamView)

