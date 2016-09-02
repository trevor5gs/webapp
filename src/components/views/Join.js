import React, { PropTypes } from 'react'
import OnboardingNavbar from '../onboarding/OnboardingNavbar'
import PasswordControl from '../forms/PasswordControl'
import UsernameControl from '../forms/UsernameControl'
import { MainView } from '../views/MainView'

const Join = (props) => {
  const {
    email,
    isValid,
    onChangePasswordControl,
    onChangeUsernameControl,
    onSubmit,
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
          onSubmit={onSubmit}
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
      />
      <div className="AnimatedCover animationCachefloweBackground" />
    </MainView>
  )
}

Join.propTypes = {
  email: PropTypes.string,
  invitationCode: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  onChangePasswordControl: PropTypes.func.isRequired,
  onChangeUsernameControl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  passwordRenderStatus: PropTypes.func,
  passwordStatus: PropTypes.string.isRequired,
  usernameRenderStatus: PropTypes.func,
  usernameStatus: PropTypes.string.isRequired,
  usernameSuggestions: PropTypes.array,
}


export default Join
