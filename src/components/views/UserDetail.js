import React, { PropTypes } from 'react'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'
import { ZeroStateCreateRelationship, ZeroStateFirstPost, ZeroStateSayHello } from '../zeros/Zeros'

const ZeroStates = ({
  isLoggedIn,
  isSelf,
  hasSaidHelloTo,
  hasZeroFollowers,
  hasZeroPosts,
  onSubmitHello,
  userId,
  username,
  }) =>
    <div className="ZeroStates">
      {isSelf && hasZeroPosts && <ZeroStateFirstPost />}
      {!isSelf && hasZeroFollowers &&
        <ZeroStateCreateRelationship {...{ userId, username }} />
      }
      {isLoggedIn && !isSelf && hasZeroPosts &&
        <ZeroStateSayHello
          onSubmit={() => onSubmitHello({ username })}
          hasPosted={hasSaidHelloTo}
          username={username}
        />
      }
    </div>
ZeroStates.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  hasSaidHelloTo: PropTypes.bool.isRequired,
  hasZeroFollowers: PropTypes.bool.isRequired,
  hasZeroPosts: PropTypes.bool.isRequired,
  onSubmitHello: PropTypes.func,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}
ZeroStates.defaultProps = {
  onSubmitHello: null,
}

export const UserDetail = (props) => {
  // deconstruct props
  const {
    hasSaidHelloTo,
    hasZeroFollowers,
    hasZeroPosts,
    isLoggedIn,
    isPostHeaderHidden,
    isSelf,
    onSubmitHello,
    streamAction,
    userId,
    username,
  } = props

  // construct component props
  const streamProps = { action: streamAction, isPostHeaderHidden }
  const zeroProps = {
    isLoggedIn,
    isSelf,
    hasSaidHelloTo,
    hasZeroFollowers,
    hasZeroPosts,
    onSubmitHello,
    userId,
    username,
  }
  return (
    <MainView className="UserDetail">
      <div className="UserDetails">
        {(hasZeroPosts || hasZeroFollowers) && <ZeroStates {...zeroProps} />}
        {streamAction && <StreamContainer {...streamProps} />}
      </div>
    </MainView>
  )
}
UserDetail.propTypes = {
  hasSaidHelloTo: PropTypes.bool.isRequired,
  hasZeroFollowers: PropTypes.bool.isRequired,
  hasZeroPosts: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isPostHeaderHidden: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  onSubmitHello: PropTypes.func,
  streamAction: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}
UserDetail.defaultProps = {
  onSubmitHello: null,
  onTabClick: null,
}

export const UserDetailError = ({ children }) =>
  <MainView className="UserDetail">
    <section className="StreamContainer isError">
      {children}
    </section>
  </MainView>
UserDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

