import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'

class FilterBar extends Component {
  static propTypes = {
    links: PropTypes.array,
    router: PropTypes.object.isRequired,
    type: PropTypes.string,
  }

  render() {
    const { links, router, type } = this.props
    return (
      <div className={classNames({ FilterBar: true, FilterText: type === 'text', FilterIcon: type === 'icon' })}>
        {links.map((item) => {
          return <Link className={classNames('FilterLink', { active: item.to === router.location.pathname })} to={item.to} key={item.to}>{item.children}</Link>
        })}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    router: state.router,
  }
}

export default connect(mapStateToProps)(FilterBar)

