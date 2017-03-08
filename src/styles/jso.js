// @flow
// JavaScript Style Objects (jso)
// TODO: Note web vs native properties
// TODO: Should web only props live in cso?

// -------------------------------------
// Configuration

export const sansRegularFontStack = '"AtlasGroteskRegular", "AtlasGrotesk-Regular", "Helvetica Neue", "HelveticaNeue", "Helvetica", sans-serif'
export const sansBoldFontStack = '"AtlasGroteskBold", "AtlasGrotesk-Bold", "Helvetica Neue", "HelveticaNeue", "Helvetica", sans-serif'
export const monoRegularFontStack = '"AtlasTypewriterRegular", "AtlasTypewriter-Regular", "Andale Mono", "Consolas", "Lucida Console", "Menlo", "Luxi Mono", monospace'

export const speed = '0.2s'

// -------------------------------------
// Typography

export const sansRegular = {
  fontFamily: sansRegularFontStack,
  fontStyle: 'normal',
  fontWeight: 400,
}

export const sansItalic = {
  fontFamily: sansRegularFontStack,
  fontStyle: 'italic',
  fontWeight: 400,
}

export const sansBold = {
  fontFamily: sansBoldFontStack,
  fontStyle: 'normal',
  fontWeight: 700,
}

export const sansBoldItalic = {
  fontFamily: sansBoldFontStack,
  fontStyle: 'italic',
  fontWeight: 700,
}

export const monoRegular = {
  fontFamily: monoRegularFontStack,
  fontStyle: 'normal',
  fontWeight: 400,
}

export const leftAlign = { textAlign: 'left' }
export const center = { textAlign: 'center' }
export const rightAlign = { textAlign: 'right' }
export const nowrap = { whiteSpace: 'nowrap' }
export const breakWord = { wordWrap: 'break-word' }

// -------------------------------------
// Position

export const relative = { position: 'relative' }
export const absolute = { position: 'absolute' }
export const fixed = { position: 'fixed' }

// -------------------------------------
// Layout

export const block = { display: 'block' }
export const inline = { display: 'inline' }
export const inlineBlock = { display: 'inline-block' }
export const displayNone = { display: 'none' }
export const visible = { visibility: 'visible' }
export const hidden = { visibility: 'hidden' }
export const fit = { maxWidth: '100%' }
export const overflowVisible = { overflow: 'visible' }
export const overflowHidden = { overflow: 'hidden' }
export const overflowScroll = { overflow: 'scroll' }

// -------------------------------------
// Alignment

export const alignBaseline = { verticalAlign: 'baseline' }
export const alignTop = { verticalAlign: 'top' }
export const alignMiddle = { verticalAlign: 'middle' }
export const alignBottom = { verticalAlign: 'bottom' }

// -------------------------------------
// Paddings

export const wrapperPaddingX = {
  paddingRight: 10,
  paddingLeft: 10,
}

// -------------------------------------
// Margins
// -------------------------------------
// Flex

// - [css-tricks flexbox guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
// - [react-native flex implementation](https://facebook.github.io/yoga/)

export const flex = { display: 'flex' }
export const inlineFlex = { display: 'inline-flex' }
export const flexColumn = { flexDirection: 'column' }
export const flexRow = { flexDirection: 'row' }
export const flexWrap = { flexWrap: 'wrap' }
export const flexNoWrap = { flexWrap: 'nowrap' }
export const justifyStart = { justifyContent: 'flex-start' }
export const justifyEnd = { justifyContent: 'flex-end' }
export const justifyCenter = { justifyContent: 'center' }
export const justifySpaceBetween = { justifyContent: 'space-between' }
export const justifySpaceAround = { justifyContent: 'space-around' }
export const itemsStart = { alignItems: 'flex-start' }
export const itemsEnd = { alignItems: 'flex-end' }
export const itemsCenter = { alignItems: 'center' }
export const itemsBaseline = { alignItems: 'baseline' }
export const itemsStretch = { alignItems: 'stretch' }
export const contentStart = { alignContent: 'flex-start' }
export const contentEnd = { alignContent: 'flex-end' }
export const contentCenter = { alignContent: 'center' }
export const contentBetween = { alignContent: 'space-between' }
export const contentAround = { alignContent: 'space-around' }
export const contentStretch = { alignContent: 'stretch' }
export const selfStart = { alignSelf: 'flex-start' }
export const selfEnd = { alignSelf: 'flex-end' }
export const selfCenter = { alignSelf: 'center' }
export const selfBaseline = { alignSelf: 'baseline' }
export const selfStretch = { alignSelf: 'stretch' }

// -------------------------------------
// Colors
// -------------------------------------
// Animations
// -------------------------------------

