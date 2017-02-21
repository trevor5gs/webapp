import React, { PropTypes } from 'react'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Following = ({ streamAction }) =>
  <MainView className="Following">
    <StreamContainer action={streamAction} />
  </MainView>

Following.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Following

