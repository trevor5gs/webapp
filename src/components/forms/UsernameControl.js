import React, { Component, PropTypes } from 'react'
import FormControl from './FormControl'

class UsernameControl extends Component {

  componentWillMount() {
    this.renderSuggestions = ::this.renderSuggestions
    this.handleUsernameSuggestionClick = ::this.handleUsernameSuggestionClick
  }

  handleUsernameSuggestionClick(e) {
    const val = e.target.title
    this.refs.FormControl.handleChange({ target: { value: val } })
  }

  renderSuggestions() {
    const { suggestions } = this.props
    if (suggestions && suggestions.length) {
      return (
        <div className="FormControlSuggestionList hasSuggestions">
          <p>Here are some available usernames &mdash;</p>
          { suggestions.map((suggestion, i) => {
            return (
              <button
                title={ suggestion }
                onClick={ this.handleUsernameSuggestionClick }
                key={ `suggestion_${i}` }
              >
                { suggestion }
              </button>
            )
          })}
        </div>
      )
    }
    return (
      <p className="FormControlSuggestionList">
        <span></span>
      </p>
    )
  }

  render() {
    return (
      <FormControl
        { ...this.props }
        autoCapitalize="off"
        autoCorrect="off"
        ref="FormControl"
        maxLength="50"
        renderFeedback={ this.renderSuggestions }
        type="text"
      />
    )
  }
}

UsernameControl.propTypes = {
  suggestions: PropTypes.array,
}

UsernameControl.defaultProps = {
  className: 'UsernameControl',
  id: 'username',
  label: 'Username',
  name: 'user[username]',
  placeholder: 'Enter your username',
  suggestions: null,
}

export default UsernameControl

