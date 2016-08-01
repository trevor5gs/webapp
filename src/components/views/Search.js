import React, { PropTypes } from 'react'
import Promotion from '../assets/Promotion'
import SearchControl from '../forms/SearchControl'
import StreamContainer from '../../containers/StreamContainer'
import { TabListButtons } from '../tabs/TabList'
import { MainView } from '../views/MainView'

export const Search = ({
  coverDPI,
  isLoggedIn,
  onChange,
  onClickTrackCredits,
  onSubmit,
  promotion,
  streamAction,
  streamKey,
  tabs,
  terms,
  type,
  }) =>
  <MainView className="Search">
    <Promotion
      coverDPI={coverDPI}
      isLoggedIn={isLoggedIn}
      onClickTrackCredits={onClickTrackCredits}
      promotion={promotion}
    />
    <form className="SearchBar" onSubmit={onSubmit}>
      <SearchControl onChange={onChange} text={terms} />
      <TabListButtons
        activeType={type}
        className="SearchTabList"
        onTabClick={onChange}
        tabClasses="LabelTab SearchLabelTab"
        tabs={tabs}
      />
    </form>
    <StreamContainer key={streamKey} action={streamAction} />
  </MainView>

Search.propTypes = {
  coverDPI: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClickTrackCredits: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  promotion: PropTypes.object,
  streamAction: PropTypes.object,
  streamKey: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  terms: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

