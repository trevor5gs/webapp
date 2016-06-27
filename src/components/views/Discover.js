import React, { PropTypes } from 'react'
import Promotion from '../assets/Promotion'
import StreamComponent from '../streams/StreamComponent'
import { HoverMenu } from '../modals/HoverMenu'
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
    hoverCategories,
    isBeaconActive,
    isDiscoverMenuActive,
    isLoggedIn,
    onClickDots,
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
    <TabListLinks
      activePath={pathname}
      className="LabelTabList"
      tabClasses="LabelTab"
      tabs={tabs}
    />
    {
      hoverCategories && hoverCategories.length ?
        <HoverMenu
          categories={hoverCategories}
          isHoverMenuActive={isDiscoverMenuActive}
          onClickDots={onClickDots}
        /> :
        null
    }
    <StreamComponent action={streamAction} />
  </MainView>

Discover.propTypes = {
  coverDPI: PropTypes.string.isRequired,
  hoverCategories: PropTypes.array,
  isBeaconActive: PropTypes.bool.isRequired,
  isDiscoverMenuActive: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClickDots: PropTypes.func.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onDismissZeroStream: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  promotions: PropTypes.array.isRequired,
  streamAction: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
}

