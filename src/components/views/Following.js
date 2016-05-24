import React, { PropTypes } from 'react'
import StreamComponent from '../streams/StreamComponent'
import { MainView } from '../views/MainView'
import { ZeroStream } from '../zeros/Zeros'

const FollowingZeroStream = ({ onDismissZeroStream }) =>
  <ZeroStream onDismiss={onDismissZeroStream}>
    Follow the creators and communities that inspire you.
  </ZeroStream>

FollowingZeroStream.propTypes = {
  onDismissZeroStream: PropTypes.func.isRequired,
}

export const Following = ({
    isBeaconActive,
    onDismissZeroStream,
    streamAction,
  }) =>
  <MainView className="Following Blah">
    {isBeaconActive ? <FollowingZeroStream onDismissZeroStream={onDismissZeroStream} /> : null}
    <StreamComponent action={streamAction} />
  </MainView>

Following.propTypes = {
  isBeaconActive: PropTypes.bool.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  streamAction: PropTypes.object.isRequired,
}

