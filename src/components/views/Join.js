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
    onNextClick,
    passwordRenderStatus,
    passwordStatus,
    usernameRenderStatus,
    usernameStatus,
    usernameSuggestions,
  } = props
  const domain = ENV.AUTH_DOMAIN
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
            classList="isSimpleWhiteControl"
            label="Username"
            onChange={onChangeUsernameControl}
            placeholder="Username"
            status={usernameStatus}
            renderStatus={usernameRenderStatus}
            suggestions={usernameSuggestions}
            tabIndex="1"
          />
          <PasswordControl
            classList="isSimpleWhiteControl"
            label="Password"
            onChange={onChangePasswordControl}
            placeholder="Password"
            status={passwordStatus}
            renderStatus={passwordRenderStatus}
            tabIndex="2"
          />
        </form>
        <p className="AuthenticationTermsCopy">
          By continuing you are agreeing to our <a href={`${domain}/wtf/post/policies`}>Terms</a>.
        </p>
      </div>
      <OnboardingNavbar
        isNextDisabled={!isValid}
        nextLabel="Continue"
        onNextClick={onNextClick}
      />
      <Cover
        coverDPI={coverDPI}
        coverImage={coverImage}
        coverOffset={coverOffset}
        modifiers="isFullScreen hasOverlay60"
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
  onNextClick: PropTypes.func.isRequired,
  passwordRenderStatus: PropTypes.func,
  passwordStatus: PropTypes.string.isRequired,
  usernameRenderStatus: PropTypes.func,
  usernameStatus: PropTypes.string.isRequired,
  usernameSuggestions: PropTypes.array,
}


export default Join
