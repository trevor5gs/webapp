import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class FilterBar extends React.Component {

  render() {
    const { links, router, type } = this.props
    return (
      <div className={classNames({ FilterBar: true, FilterText: type === 'text', FilterIcon: type === 'icon' })}>
        {links.map((item) => {
          return <Link className={classNames({ active: item.to === router.location.pathname })} to={item.to} key={item.to}>{item.children}</Link>
        })}
      </div>
    )
  }
}

// This should be a selector: @see: https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {
    router: state.router,
  }
}

FilterBar.propTypes = {
  links: React.PropTypes.array,
  router: React.PropTypes.object.isRequired,
  type: React.PropTypes.string,
}

export default connect(mapStateToProps)(FilterBar)
