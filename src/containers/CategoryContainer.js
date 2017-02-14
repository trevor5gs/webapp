import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  selectCategoryName,
  selectCategorySlug,
  selectCategoryTileImageUrl,
} from '../selectors/categories'

function mapStateToProps(state, props) {
  return {
    name: selectCategoryName(state, props),
    slug: selectCategorySlug(state, props),
    tileImageUrl: selectCategoryTileImageUrl(state, props),
  }
}

class CategoryContainer extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    tileImageUrl: PropTypes.string.isRequired,
  }

  render() {
    const { name, slug, tileImageUrl } = this.props
    return (
      <Link
        className="CategoryLink"
        to={`/discover/${slug}`}
        style={{ backgroundImage: `url("${tileImageUrl}")` }}
      >
        <span className="CategoryLinkName">{name}</span>
      </Link>
    )
  }
}

export default connect(mapStateToProps)(CategoryContainer)

