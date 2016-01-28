import React from 'react'
import classNames from 'classnames'
import { loadCommunities } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import Picker from '../pickers/Picker'

class CommunityPicker extends Picker {

  componentWillMount() {
    this.followAll = ::this.followAll
  }

  getRelationshipButton(refs) {
    const userContainer = refs.wrappedInstance
    if (userContainer) {
      return userContainer.refs.RelationshipImageButton
    }
    return null
  }

  render() {
    const klassNames = classNames(
      'CommunityPicker',
      'Panel',
      { isFollowingAll: this.isFollowingAll() },
    )
    return (
      <div className={klassNames}>
        <button className="PickerButton" ref="followAllButton" onClick={ this.followAll }>
          <span>{this.renderBigButtonText()}</span>
        </button>
        <StreamComponent ref="streamComponent" action={loadCommunities()} />
      </div>
    )
  }
}

export default CommunityPicker

