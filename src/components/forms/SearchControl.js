import React, { Component, PropTypes } from 'react'
import FormControl from './FormControl'
import { TabListButtons } from '../tabs/TabList'

class SearchControl extends Component {

  static propTypes = {
    activeType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    text: PropTypes.string,
    tabs: PropTypes.array.isRequired,
  }

  static defaultProps = {
    className: 'SearchControl',
    id: 'terms',
    label: 'Search',
    name: 'search[terms]',
    placeholder: 'Search',
  }

  shouldComponentUpdate(nextProps) {
    return this.props.text !== nextProps.text || this.props.activeType !== nextProps.activeType
  }

  render() {
    const { activeType, onChange, onSubmit, tabs } = this.props
    return (
      <form className="SearchBar" onSubmit={onSubmit}>
        <FormControl
          {...this.props}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          autoFocus
          type="text"
        />
        <TabListButtons
          activeType={activeType}
          className="SearchTabList"
          onTabClick={onChange}
          tabClasses="LabelTab SearchLabelTab"
          tabs={tabs}
        />
      </form>
    )
  }
}

export default SearchControl

