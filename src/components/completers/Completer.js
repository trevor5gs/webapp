import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import Completion from './Completion'

export default class Completer extends Component {

  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.object,
    completions: PropTypes.array,
    onCompletion: PropTypes.func,
  };

  render() {
    const { className, completions, onCompletion } = this.props
    if (!completions || !completions.length) {
      return null
    }
    return (
      <div className={ classNames(className, 'Completer') }>
        {completions.map((completion, i) =>
          <Completion
            key={ `completion_${i}` }
            asset={ completion.asset }
            label={ completion.label }
            value={ completion.value }
            onClick={ onCompletion }
          />
        )}
      </div>
    )
  }
}

