import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { isAndroid } from '../../vendor/jello'
import { PhoneIcon, ChevronIcon, ListIcon, GridIcon } from '../footer/FooterIcons'
import { FooterLabel } from '../footer/FooterLabel'
import { FooterLink } from '../footer/FooterLink'
import { FooterTool } from '../footer/FooterTool'

export const Footer = ({
  isGridMode,
  isLayoutToolHidden,
  isPaginatoring,
  onClickScrollToTop,
  onClickToggleLayoutMode,
}) =>
  <footer
    className={classNames('Footer', { isPaginatoring })}
    role="contentinfo"
  >
    <div className="FooterLinks">
      <FooterLabel label="Beta" />
      <FooterLink
        className="asLabel"
        href={`${ENV.AUTH_DOMAIN}/wtf`}
        label="WTF"
      />
      {isAndroid() ?
        null :
        <FooterLink
          href="https://ello.co/wtf/resources/mobile-features/"
          icon={<PhoneIcon />}
          label="Apps"
        />
      }
    </div>
    <div className="FooterTools">
      <FooterTool
        className="TopTool"
        icon={<ChevronIcon />}
        label="Top"
        onClick={onClickScrollToTop}
      />
      {!isLayoutToolHidden ?
        <FooterTool
          className="LayoutTool"
          icon={isGridMode ? <ListIcon /> : <GridIcon />}
          label={isGridMode ? 'List View' : 'Grid View'}
          onClick={onClickToggleLayoutMode}
        /> : null
      }
    </div>
  </footer>

Footer.propTypes = {
  isGridMode: PropTypes.bool.isRequired,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isPaginatoring: PropTypes.bool.isRequired,
  onClickScrollToTop: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
}

export default Footer

