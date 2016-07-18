import React, { Component, PropTypes } from 'react'
import TextControl from '../forms/TextControl'

class AffiliateDialog extends Component {

  componentWillMount() {
    this.value = this.props.text
  }

  onClickSubmit = () => {
    this.props.onConfirm({ value: this.value })
  }

  onClickReset = () => {
    this.props.onConfirm({ value: null })
  }

  onChangeControl = ({ affiliateLink }) => {
    this.value = affiliateLink
  }

  render() {
    const { onDismiss, text } = this.props
    return (
      <div className="Dialog AffiliateDialog">
        <h2 className="AffiliateDialogTitle">Sell your work</h2>
        <TextControl
          classList="asBoxControl AffiliateDialogControl"
          id="affiliateLink"
          label="Product detail URL"
          name="affiliate[productDetail]"
          onChange={this.onChangeControl}
          placeholder="Product detail URL"
          tabIndex="1"
          text={text}
        />
        <button
          className="AffiliateDialogButton isSubmit"
          onClick={this.onClickSubmit}
        >
          {text && text.length ? 'Update' : 'Submit'}

        </button>
        {text && text.length ?
          <button
            className="AffiliateDialogButton isRemove"
            onClick={this.onClickReset}
          >
            Remove
          </button> :
          null
        }
        <button className="AffiliateDialogButton" onClick={onDismiss}>Cancel</button>
      </div>
    )
  }
}

AffiliateDialog.propTypes = {
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
  text: PropTypes.string,
}

export default AffiliateDialog

