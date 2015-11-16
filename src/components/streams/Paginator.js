import React from 'react'
import { ElloMark } from '../iconography/ElloIcons'

class Paginator extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = { isPaginationLoading: false }
  }

  render() {
    const { isPaginationLoading } = this.state
    const classes = isPaginationLoading ? 'Paginator isBusy' : 'Paginator'
    const message = isPaginationLoading ? 'Loading page 1 of 10' : 'Page 1 of 10'

    return (
      <div className={ classes }>
        <ElloMark />
        <span>{ message }</span>
      </div>
    )
  }
}

export default Paginator

