import React, { PropTypes } from 'react'
import Cover from '../assets/Cover'
import OnboardingNavbar from '../onboarding/OnboardingNavbar'
import PasswordControl from '../forms/PasswordControl'
import UsernameControl from '../forms/UsernameControl'
import { MainView } from '../views/MainView'

const Join = (props) => {
  const {
    coverDPI,
    coverImage,
    coverOffset,
    email,
    isValid,
    onChangePasswordControl,
    onChangeUsernameControl,
    onDoneClick,
    onNextClick,
    passwordRenderStatus,
    passwordStatus,
    usernameRenderStatus,
    usernameStatus,
    usernameSuggestions,
  } = props
  return (
    <MainView className="Authentication isJoinForm">
      <div className="AuthenticationFormDialog">
        <form
          className="AuthenticationForm"
          id="RegistrationForm"
          noValidate="novalidate"
          onSubmit={onNextClick}
          role="form"
        >
          <UsernameControl
            autoFocus={email && email.length}
            classList="isBoxControl"
            label="Username"
            onChange={onChangeUsernameControl}
            placeholder="Create your username"
            status={usernameStatus}
            renderStatus={usernameRenderStatus}
            suggestions={usernameSuggestions}
            tabIndex="1"
          />
          <PasswordControl
            classList="isBoxControl"
            label="Password"
            onChange={onChangePasswordControl}
            placeholder="Set your password"
            status={passwordStatus}
            renderStatus={passwordRenderStatus}
            tabIndex="2"
          />
        </form>
        <p className="AuthenticationTermsCopy">
          By clicking Create Account you are agreeing to our
          <a href={`${ENV.AUTH_DOMAIN}/wtf/post/policies`}>Terms</a>.
        </p>
      </div>
      <OnboardingNavbar
        isNextDisabled={!isValid}
        nextLabel="Continue"
        onDoneClick={onDoneClick}
        onNextClick={onNextClick}
      />
      <Cover
        coverDPI={coverDPI}
        coverImage={coverImage}
        coverOffset={coverOffset}
        modifiers="isFullScreen hasOverlay"
      />
    </MainView>
  )
}

Join.propTypes = {
  coverDPI: PropTypes.string,
  coverImage: PropTypes.string,
  coverOffset: PropTypes.number,
  email: PropTypes.string,
  invitationCode: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  onChangePasswordControl: PropTypes.func.isRequired,
  onChangeUsernameControl: PropTypes.func.isRequired,
  onDoneClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  passwordRenderStatus: PropTypes.object,
  passwordStatus: PropTypes.string.isRequired,
  usernameRenderStatus: PropTypes.object,
  usernameStatus: PropTypes.string.isRequired,
  usernameSuggestions: PropTypes.array,
}


export default Join
