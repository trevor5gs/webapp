import React from 'react'
import App from './App'

class Staff extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.typeSpecimen = {
      lowercase: 'amazingly few discotheques prövide jukeboxes.',
      uppercase: 'AMAZINGLY FEW DISCOTHEQUES PRÖVIDE JUKEBOXES.',
      numbers: '0123456789',
      characters: '~`!@#$%^&*()-_+={}[]|\\;:\'\"<>,.?/.',
    }
  }

  renderMonospaceFamily() {
    return (
      <div>
        <p className="monospace">AtlasTypewriterRegular</p>
        <p className="monospace">{this.typeSpecimen.lowercase}</p>
        <p className="monospace">{this.typeSpecimen.uppercase}</p>
        <p className="monospace">{this.typeSpecimen.numbers}</p>
        <p className="monospace">{this.typeSpecimen.characters}</p>
        <p><code>+monospace-family</code></p>
      </div>
    )
  }

  renderSansFamily() {
    return (
      <div>
        <p>AtlasGroteskRegular</p>
        <p>{this.typeSpecimen.lowercase}</p>
        <p>{this.typeSpecimen.uppercase}</p>
        <p>{this.typeSpecimen.numbers}</p>
        <p>{this.typeSpecimen.characters}</p>
        <p><code>+sans-family</code></p>
      </div>
    )
  }

  renderSansBoldFamily() {
    return (
      <div>
        <p><strong>AtlasGroteskBold</strong></p>
        <p><strong>{this.typeSpecimen.lowercase}</strong></p>
        <p><strong>{this.typeSpecimen.uppercase}</strong></p>
        <p><strong>{this.typeSpecimen.numbers}</strong></p>
        <p><strong>{this.typeSpecimen.characters}</strong></p>
        <p><code>+sans-bold-family</code></p>
      </div>
    )
  }

  renderSansItalicFamily() {
    return (
      <div>
        <p><em>AtlasGroteskItalic</em></p>
        <p><em>{this.typeSpecimen.lowercase}</em></p>
        <p><em>{this.typeSpecimen.uppercase}</em></p>
        <p><em>{this.typeSpecimen.numbers}</em></p>
        <p><em>{this.typeSpecimen.characters}</em></p>
        <p><code>+sans-italic-family</code></p>
      </div>
    )
  }

  renderSansBoldItalicFamily() {
    return (
      <div>
        <p><strong><em>AtlasGroteskBoldItalic</em></strong></p>
        <p><strong><em>{this.typeSpecimen.lowercase}</em></strong></p>
        <p><strong><em>{this.typeSpecimen.uppercase}</em></strong></p>
        <p><strong><em>{this.typeSpecimen.numbers}</em></strong></p>
        <p><strong><em>{this.typeSpecimen.characters}</em></strong></p>
        <p><code>+sans-bold-italic-family</code></p>
      </div>
    )
  }

  render() {
    return (
      <App>
        <section
          className="Staff Panel"
          style={{
            paddingLeft: '20px',
          }}
          >
          <h1>StaffView</h1>
          {this.renderMonospaceFamily()}
          <hr/>
          {this.renderSansFamily()}
          <hr/>
          {this.renderSansBoldFamily()}
          <hr/>
          {this.renderSansItalicFamily()}
          <hr/>
          {this.renderSansBoldItalicFamily()}
          <hr/>
          <h2 className="heading">Heading & Copy</h2>
          <p>The Budnitz Bicycles Model No.1 Titanium is made out of just 93 quality parts (we’re not counting spokes). This simple design is one of the reasons that our bicycles require so little maintanance, and have such an incredibly smooth ride.</p>
          <p>We’re excited to offer our ultimate urban assault vehicle with a honey-leather Brooks saddle, matching grips, and German-designed 2.35-inch Super Moto tires. All 2014 versions of our Model No.3 will now fit these amazing oversized slick racing tires — guaranteed to terrorize the neighborhood, in both comfort and style</p>
          <p><span>Inline textual elements:</span> <small>small</small> <em>em</em> <strong>strong</strong> <sub>sub</sub> <sup>sup</sup> <code>code</code> <a href="#">link</a></p>
        </section>
      </App>
    )
  }
}

export default Staff

