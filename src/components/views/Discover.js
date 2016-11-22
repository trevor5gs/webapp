import React, { PropTypes } from 'react'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Discover = ({
  streamAction,
  }) =>
    <MainView className="Discover">
      <StreamContainer action={streamAction} />
    </MainView>

Discover.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Discover

