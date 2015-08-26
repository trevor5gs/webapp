import React from 'react'
import { PlusIcon, MinusIcon } from '../iconography/Icons'
import { ElloBoxMark } from '../iconography/ElloIcons'

class SearchView extends React.Component {
  render() {
    return (
      <div className="Panel">
        <h1 className="heading">The Search</h1>
        <PlusIcon />
        <MinusIcon />
        <ElloBoxMark />
      </div>
    )
  }
}

export default SearchView

