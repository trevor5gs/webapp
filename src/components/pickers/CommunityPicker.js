import React from 'react'
import Picker from './Picker'
import classNames from 'classnames'
import { loadCommunities } from '../../actions/onboarding'
import StreamComponent from '../streams/StreamComponent'
import Button from '../buttons/Button'


class CommunityPicker extends Picker {

  render() {
    return (
      <div className={classNames('CommunityPicker', 'Panel', {isFollowingAll: this.isFollowingAll()})}>
        <Button ref="followAllButton" onClick={() => this.followAll()}>
          <span>{this.renderBigButtonText()}</span>
        </Button>
        <StreamComponent ref="streamComponent" action={loadCommunities} />
      </div>
    )
  }
}

CommunityPicker.propTypes = {
  relationshipMap: React.PropTypes.any.isRequired,
}

export default CommunityPicker

