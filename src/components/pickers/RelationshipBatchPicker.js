import React from 'react'

class RelationshipBatchPicker extends React.Component {
  componentDidMount() {
    this.leaveMethod = this.routerWillLeave.bind(this)
    this.context.router.addTransitionHook(this.leaveMethod)
  }

  routerWillLeave() {
    const friends = React.findDOMNode(this).querySelectorAll('[data-priority="friend"]')
    const postPayload = { user_ids: [], priority: 'friend'}
    for (const value of friends) {
      postPayload.user_ids.push(value.dataset.userId)
    }
  }

  componentWillUnmount() {
    this.context.router.removeTransitionHook(this.leaveMethod)
  }
}

RelationshipBatchPicker.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default RelationshipBatchPicker

