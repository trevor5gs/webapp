import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'

export const Discover = ({
  pageTitle,
  streamAction,
  title,
  }) =>
    <MainView className="Discover">
      <Helmet
        title={title}
        meta={[
          { property: 'og:title', content: title },
          { name: 'name', itemprop: 'name', content: title },
        ]}
      />
      {pageTitle ? <h1 className="DiscoverPageTitle">{pageTitle}</h1> : null}
      <StreamContainer action={streamAction} />
    </MainView>

Discover.propTypes = {
  pageTitle: PropTypes.string,
  streamAction: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
}

export default Discover

