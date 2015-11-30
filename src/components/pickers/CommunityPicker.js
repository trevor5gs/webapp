import React from 'react'
import Picker from './Picker'
import classNames from 'classnames'
import { loadCommunities } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'

class CommunityPicker extends Picker {

  render() {
    return (
      <div className={classNames('CommunityPicker', 'Panel', {isFollowingAll: this.isFollowingAll()})}>
        <button className="PickerButton" ref="followAllButton" onClick={() => this.followAll()}>
          <span>{this.renderBigButtonText()}</span>
        </button>
        <StreamComponent ref="streamComponent" action={loadCommunities()} />
      </div>
    )
  }
}

export default CommunityPicker

