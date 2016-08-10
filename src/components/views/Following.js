import React, { PropTypes } from 'react'
import StreamContainer from '../../containers/StreamContainer'
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
  <MainView className="Following">
    {isBeaconActive ? <FollowingZeroStream onDismissZeroStream={onDismissZeroStream} /> : null}
    <StreamContainer action={streamAction} scrollSessionKey="/following" />
  </MainView>

Following.propTypes = {
  isBeaconActive: PropTypes.bool.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  streamAction: PropTypes.object.isRequired,
}

export default Following

