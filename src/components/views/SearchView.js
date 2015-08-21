import React from 'react'
import { PlusIcon, MinusIcon } from '../iconography/Icons'
import { ElloBoxMark, ElloMark } from '../iconography/ElloIcons'

class SearchView extends React.Component {
  render() {
    return (
      <div className="Panel">
        <h1>The Search</h1>
        <PlusIcon />
        <MinusIcon />
        <ElloMark />
        <ElloBoxMark />
      </div>
    )
  }
}

export default SearchView

