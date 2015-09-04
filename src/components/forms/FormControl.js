import React from 'react'

class FormControl extends React.Component {
  constructor(props, context) {
    super(props, context)
    const { text, hasFocus } = this.props
    this.state = {
      text: text || '',
      hasValue: text ? text.length : false,
      hasFocus: hasFocus || false,
    }
  }


  handleChange(e) {
    const val = e.target.value
    this.setState({ text: val, hasValue: val.length })
  }

  handleFocus() {
    this.setState({ hasFocus: true })
  }

  handleBlur() {
    this.setState({ hasFocus: false })
  }
}

export default FormControl

