import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Promotion from '../assets/Promotion'
import StreamComponent from '../streams/StreamComponent'
import { TabListLinks } from '../tabs/TabList'
import { MainView } from '../views/MainView'
import { ZeroStream } from '../zeros/Zeros'

const DiscoverZeroStream = ({ onDismissZeroStream }) =>
  <ZeroStream onDismiss={onDismissZeroStream}>
    Explore creators and communities. Realize the promise of the internet.
  </ZeroStream>

DiscoverZeroStream.propTypes = {
  onDismissZeroStream: PropTypes.func.isRequired,
}

export const Discover = ({
    coverDPI,
    isBeaconActive,
    isLoggedIn,
    onClickTrackCredits,
    onDismissZeroStream,
    pathname,
    promotions,
    streamAction,
    tabs,
  }) =>
  <MainView className="Discover">
    {isBeaconActive ? <DiscoverZeroStream onDismissZeroStream={onDismissZeroStream} /> : null}
    <Promotion
      coverDPI={coverDPI}
      creditsClickAction={onClickTrackCredits}
      isLoggedIn={isLoggedIn}
      userlist={promotions}
    />
    <div className="CategoryTabBar">
      <TabListLinks
        activePath={pathname}
        className="LabelTabList CategoryTabBarLeft"
        tabClasses="LabelTab CategoryTabBarLabelTab"
        tabs={tabs}
      />
      <div className="CategoryTabBarRight">
        <Link to="/discover/all">See All</Link>
      </div>
    </div>
    <StreamComponent action={streamAction} />
  </MainView>

Discover.propTypes = {
  coverDPI: PropTypes.string.isRequired,
  isBeaconActive: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  promotions: PropTypes.array.isRequired,
  streamAction: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
}

