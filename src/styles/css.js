// @flow
// Global CSS reset, setup, normalization and font-faces

import { sansRegularFontStack } from './jso'

// -------------------------------------
// Fonts
export const atlasGroteskRegular = `
@font-face {
  font-family: AtlasGroteskRegular;
  font-style: normal;
  font-weight: 400;
  font-stretch: normal;
  src:
    local('AtlasGrotesk-Regular'),
    url("//fonts.ello.co/AtlasGrotesk-Regular-Web.eot?#iefix") format("embedded-opentype"),
    url("//fonts.ello.co/AtlasGrotesk-Regular-Web.woff") format("woff"),
    url("//fonts.ello.co/AtlasGrotesk-Regular-Web.ttf") format("truetype"),
    url("//fonts.ello.co/AtlasGrotesk-Regular-Web.svg#AtlasGroteskRegular") format("svg");
}
`.replace(/\n/g, '')

export const atlasGroteskBold = `
@font-face {
  font-family: AtlasGroteskBold;
  font-style: normal;
  font-weight: 700;
  font-stretch: normal;
  src:
    local('AtlasGrotesk-Bold'),
    url("//fonts.ello.co/AtlasGrotesk-Bold-Web.eot?#iefix") format("embedded-opentype"),
    url("//fonts.ello.co/AtlasGrotesk-Bold-Web.woff") format("woff"),
    url("//fonts.ello.co/AtlasGrotesk-Bold-Web.ttf") format("truetype"),
    url("//fonts.ello.co/AtlasGrotesk-Bold-Web.svg#AtlasGroteskBold") format("svg");
}
`.replace(/\n/g, '')

export const atlasGroteskTypewriter = `
@font-face {
  font-family: AtlasTypewriterRegular;
  font-style: normal;
  font-weight: 400;
  font-stretch: normal;
  src:
    local('AtlasTypewriter-Regular'),
    url("//fonts.ello.co/AtlasTypewriter-Regular-Web.eot?#iefix") format("embedded-opentype"),
    url("//fonts.ello.co/AtlasTypewriter-Regular-Web.woff") format("woff"),
    url("//fonts.ello.co/AtlasTypewriter-Regular-Web.ttf") format("truetype"),
    url("//fonts.ello.co/AtlasTypewriter-Regular-Web.svg#AtlasTypewriterRegular") format("svg");
}
`.replace(/\n/g, '')

// -------------------------------------
// Base reset and setup

export const baseStyles = `
*,
*::before,
*::after {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
html {
  font: normal 400 100% / 1.5 ${sansRegularFontStack};
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}
body {
  position: relative;
  margin: 0;
  overflow-x: hidden;
  background-color: #fff;
}
::selection {
  color: #fff;
  text-shadow: none;
  background: #000;
}
[hidden] {
  display: none;
}
`.replace(/\n/g, '')

// -------------------------------------
// Markdown (TextRegion)

export const proseStyles = `
`.replace(/\n/g, '')

