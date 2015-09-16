import React from 'react'

class RelationshipBatchPicker extends React.Component {
  componentDidMount() {
    this.leaveMethod = this.routerWillLeave.bind(this)
    this.context.router.addTransitionHook(this.leaveMethod)
  }

  routerWillLeave() {
    const friends = React.findDOMNode(this).querySelectorAll('[data-priority="friend"]')
    const userIds = []

    for (const value of friends) {
      userIds.push(value.dataset.userId)
    }
    if (!userIds.length) {
      return
    }
    this.props.saveAction(userIds, 'friend')
  }

  componentWillUnmount() {
    this.context.router.removeTransitionHook(this.leaveMethod)
  }
}

RelationshipBatchPicker.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

RelationshipBatchPicker.propTypes = {
  saveAction: React.PropTypes.func.isRequired,
}

export default RelationshipBatchPicker

