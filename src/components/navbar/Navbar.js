import React, { PropTypes } from 'react'
import { NavbarLabel } from './NavbarLabel'
import { NavbarLink } from './NavbarLink'
import { NavbarMark } from './NavbarMark'
import { SearchIcon, SparklesIcon } from './NavbarIcons'

export const NavbarLoggedOut = (props) => {
  const { currentStream, isLoggedIn, pathname } = props
  return (
    <nav className="Navbar" role="navigation" >
      <NavbarMark
        currentStream={ currentStream }
        isLoggedIn={ isLoggedIn }
      />
      <NavbarLabel />
      {
        // hasLoadMoreButton ?
        //   <NavbarMorePostsButton onClick={ this.onClickLoadMorePosts } /> :
        //   null
      }
      <div className="NavbarLinks">
        <NavbarLink
          to="/"
          label="Discover"
          modifiers="LabelOnly"
          pathname={ pathname }
          icon={ <SparklesIcon /> }
        />
        <NavbarLink
          to="/search"
          label="Search"
          modifiers="IconOnly"
          pathname={ pathname }
          icon={ <SearchIcon /> }
        />
        <NavbarLink
          to="/enter"
          label="Log in"
          modifiers="LabelOnly"
          pathname={ pathname }
        />
        <NavbarLink
          to="/signup"
          label="Sign up"
          modifiers="LabelOnly"
          pathname={ pathname }
        />
      </div>
    </nav>
  )
}

NavbarLoggedOut.propTypes = {
  currentStream: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
}

