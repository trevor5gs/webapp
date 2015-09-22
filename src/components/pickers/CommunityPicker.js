import React from 'react'
import { loadCommunities } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'

// TODO: Inject the action from the creator component?
class CommunityPicker extends React.Component {
  render() {
    return (
      <StreamComponent ref="streamComponent" action={loadCommunities} />
    )
  }
}

export default CommunityPicker

