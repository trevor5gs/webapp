import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import classNames from 'classnames'
import { debounce, isEmpty, get } from 'lodash'
import { PREFERENCES, SETTINGS } from '../../constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { preferenceToggleChanged } from '../../helpers/junk_drawer'
import { openModal, closeModal, openAlert, closeAlert } from '../../actions/modals'
import { logout } from '../../actions/authentication'
import {
  availableToggles,
  blockedUsers,
  checkAvailability,
  deleteProfile,
  exportData,
  mutedUsers,
  saveAvatar,
  saveCover,
  saveProfile,
} from '../../actions/profile'
import Emoji from '../../components/assets/Emoji'
import AdultPostsDialog from '../../components/dialogs/AdultPostsDialog'
import DeleteAccountDialog from '../../components/dialogs/DeleteAccountDialog'
import EmailControl from '../../components/forms/EmailControl'
import FormButton from '../../components/forms/FormButton'
import PasswordControl from '../../components/forms/PasswordControl'
import UsernameControl from '../../components/forms/UsernameControl'
import Preference from '../../components/forms/Preference'
import {
  getUsernameStateFromClient,
  getUsernameStateFromServer,
  getEmailStateFromClient,
  getEmailStateFromServer,
  getPasswordState,
} from '../../components/forms/Validators'
import Uploader from '../../components/uploaders/Uploader'
import Avatar from '../../components/assets/Avatar'
import Cover from '../../components/assets/Cover'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import StreamComponent from '../../components/streams/StreamComponent'
import InfoForm from '../../components/forms/InfoForm'
import { MainView } from '../../components/views/MainView'
import { isElloAndroid } from '../../vendor/jello'

class Settings extends Component {

  static propTypes = {
    blockedCount: PropTypes.number.isRequired,
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    isCoverHidden: PropTypes.bool,
    mutedCount: PropTypes.number.isRequired,
    profile: PropTypes.object,
  }

  componentWillMount() {
    const { profile } = this.props
    this.state = {
      currentPasswordState: { status: STATUS.INDETERMINATE, message: '' },
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
      emailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.passwordValue = ''
    this.passwordCurrentValue = ''
    this.emailValue = profile.email
    this.usernameValue = profile.username
    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 666)
  }

  componentDidMount() {
    // Calculate the cover height (ResizeComponent isn't initialized yet)
    const offset = Math.round((window.innerWidth * 0.5625)) - 200
    window.scrollTo(0, offset)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.profile.errors && nextProps.profile.errors) {
      const attrs = get(nextProps, 'profile.errors.attrs')
      if (attrs) {
        const obj = {}
        Object.keys(attrs).forEach((attr) => {
          obj[`${attr}State`] = { status: STATUS.FAILURE, message: attrs[attr] }
        })
        this.setState(obj)
      }
    } else if (this.props.profile.errors && !nextProps.profile.errors) {
      const obj = {}
      for (const attr of ['currentPassword', 'email', 'password', 'username']) {
        obj[`${attr}State`] = { status: STATUS.INDETERMINATE, message: '', suggestions: [] }
      }
      this.setState(obj)
    }
    const { availability } = nextProps
    if (!availability) { return }
    const prevUsername = get(availability, 'original.username', this.usernameValue)
    const prevEmail = get(availability, 'original.email', this.emailValue)
    if (availability.hasOwnProperty('username') && prevUsername === this.usernameValue) {
      this.validateUsernameResponse(availability)
    }
    if (availability.hasOwnProperty('email') && prevEmail === this.emailValue) {
      this.validateEmailResponse(availability)
    }
  }

  onLogOut = async() => {
    const { dispatch } = this.props
    await dispatch(logout())
    dispatch(push('/enter'))
  }

  onChangeUsernameControl = ({ username }) => {
    this.usernameValue = username
    const { profile } = this.props
    if (username === profile.username) {
      this.setState({
        usernameState: {
          status: STATUS.INDETERMINATE,
          suggestions: null,
          message: '',
        },
      })
      return
    }
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const clientState = getUsernameStateFromClient({ value: username, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ usernameState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateUsernameResponse` after fetching
      this.checkServerForAvailability({ username })
      return
    }
    this.setState({ usernameState: clientState })
  }

  onChangeEmailControl = ({ email }) => {
    this.emailValue = email
    const { profile } = this.props
    if (email === profile.email) {
      this.setState({ emailState: { status: STATUS.INDETERMINATE, message: '' } })
      return
    }
    const { emailState } = this.state
    const currentStatus = emailState.status
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateEmailResponse` after fetching
      this.checkServerForAvailability({ email })
      return
    }
    this.setState({ emailState: clientState })
  }

  onChangePasswordControl = ({ password }) => {
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    this.setState({ passwordState: newState })
  }

  onChangeCurrentPasswordControl = (vo) => {
    this.passwordCurrentValue = vo.current_password
  }

  onClickRequestDataExport = () => {
    const { dispatch } = this.props
    dispatch(exportData())
    this.refs.exportButton.disabled = true
    this.refs.exportButton.innerHTML = 'Exported'
  }

  onClickDeleteAccountModal = () => {
    const { dispatch, profile } = this.props
    dispatch(openModal(
      <DeleteAccountDialog
        user={profile}
        onConfirm={this.onConfirmAccountWasDeleted}
        onDismiss={this.closeModal}
      />
    , 'asDangerZone'))
  }

  onConfirmAccountWasDeleted = () => {
    const { dispatch } = this.props
    dispatch(deleteProfile())
    this.closeModal()
  }

  onSubmit = (e) => {
    const { dispatch } = this.props
    e.preventDefault()
    const formData = {
      current_password: this.passwordCurrentValue,
      email: this.emailValue,
      password: this.passwordValue,
      username: this.usernameValue,
    }
    this.clearPasswords()
    this.setState({
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
    })
    dispatch(saveProfile(formData))
  }

  onTogglePostsAdultContent = (obj) => {
    if (obj.postsAdultContent) {
      const { dispatch } = this.props
      dispatch(openModal(
        <AdultPostsDialog
          onConfirm={this.closeModal}
        />
      ))
    }
    preferenceToggleChanged(obj)
  }

  getExternalLinkListAsText() {
    const { profile } = this.props
    return (
      profile.externalLinksList.map((link, i) =>
        <a
          href={link.url}
          target="_blank"
          key={`settingslinks_${i}`}
          style={{ marginRight: `${5 / 16}rem` }}
        >
          {link.text}
        </a>
      )
    )
  }

  getOriginalAssetUrl(asset) {
    return (
    asset && asset.original && asset.original.url ?
      <a href={asset.original.url} target="_blank">View original image</a> :
      <span>&mdash;</span>
    )
  }

  shouldRequireCredentialsSave() {
    const { currentPasswordState, emailState, passwordState, usernameState } = this.state
    const credentialsSuccess = [emailState, passwordState, usernameState].some((state) =>
      state.status === STATUS.SUCCESS
    )
    return currentPasswordState.status === STATUS.FAILURE || credentialsSuccess
  }

  clearPasswords() {
    this.refs.newPasswordControl.clear()
    this.refs.currentPasswordControl.clear()
  }

  checkServerForAvailability(vo) {
    this.props.dispatch(checkAvailability(vo))
  }

  validateUsernameResponse(availability) {
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const newState = getUsernameStateFromServer({ availability, currentStatus })
    this.setState({ usernameState: newState })
  }

  validateEmailResponse(availability) {
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromServer({ availability, currentStatus })
    this.setState({ emailState: newState })
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  renderStatus(message) {
    if (message) {
      return () => <p>{message}</p>
    }
    return null
  }

  render() {
    const {
      blockedCount, coverDPI, coverOffset, dispatch, isCoverHidden, mutedCount, profile,
    } = this.props
    const { currentPasswordState, emailState, passwordState, usernameState } = this.state
    const requiresSave = this.shouldRequireCredentialsSave()
    const allowNSFWToggle = !isElloAndroid()

    if (!profile) {
      return null
    }

    // const { isInfoFormSaving } = this.state
    const mdash = <span>&mdash;</span>
    const boxControlClassNames = 'asBoxControl onWhite'

    return (
      <MainView className="Settings">
        <div className="SettingsCoverPicker">
          <Uploader
            title="Upload a header image"
            message="Or drag & drop"
            recommend="Recommended image size: 2560 x 1440"
            openAlert={bindActionCreators(openAlert, dispatch)}
            closeAlert={bindActionCreators(closeAlert, dispatch)}
            saveAction={bindActionCreators(saveCover, dispatch)}
          />
          <Cover
            coverDPI={coverDPI}
            coverImage={profile.coverImage}
            coverOffset={coverOffset}
            isHidden={isCoverHidden}
            isModifiable
          />
        </div>
        <button className="SettingsLogoutButton" onClick={this.onLogOut}>Logout</button>

        <div className="SettingsBody" >
          <div className="SettingsAvatarPicker" >
            <Uploader
              title="Pick an Avatar"
              message="Or drag & drop it"
              recommend="Recommended image size: 360 x 360"
              openAlert={bindActionCreators(openAlert, dispatch)}
              closeAlert={bindActionCreators(closeAlert, dispatch)}
              saveAction={bindActionCreators(saveAvatar, dispatch)}
            />
            <Avatar
              isModifiable
              size="large"
              sources={profile.avatar}
            />
          </div>

          <header className="SettingsHeader">
            <h1 className="SettingsHeading">Profile</h1>
            <p>
              Your username, name, bio and links appear on your public Ello
              profile. Your email address remains private.
            </p>
          </header>

          <form
            className="SettingsForm"
            noValidate="novalidate"
            onSubmit={this.onSubmit}
            role="form"
          >
            <UsernameControl
              classList={boxControlClassNames}
              label="Username"
              onChange={this.onChangeUsernameControl}
              renderStatus={this.renderStatus(usernameState.message)}
              status={usernameState.status}
              suggestions={usernameState.suggestions}
              tabIndex="1"
              text={profile.username}
            />
            <EmailControl
              classList={boxControlClassNames}
              label="Email"
              onChange={this.onChangeEmailControl}
              renderStatus={this.renderStatus(emailState.message)}
              status={emailState.status}
              tabIndex="2"
              text={profile.email}
            />
            <PasswordControl
              classList={boxControlClassNames}
              label="Password"
              onChange={this.onChangePasswordControl}
              placeholder="Set a new password"
              renderStatus={this.renderStatus(passwordState.message)}
              ref="newPasswordControl"
              status={passwordState.status}
              tabIndex="3"
            />
            <div className={classNames('SettingsCredentialActions', { requiresSave })}>
              <p>To save changes you must re-enter your current Ello password.</p>
              <PasswordControl
                classList={boxControlClassNames}
                id="current_password"
                label="Password - Please enter your current one."
                name="user[current_password]"
                onChange={this.onChangeCurrentPasswordControl}
                placeholder="Enter current password"
                ref="currentPasswordControl"
                status={currentPasswordState.status}
                tabIndex={requiresSave ? '4' : '0'}
              />
              <FormButton disabled={!requiresSave}>Save</FormButton>
            </div>
          </form>

          <InfoForm
            controlClassModifiers={boxControlClassNames}
            showSaveMessage
            tabIndexStart={requiresSave ? 5 : 4}
          />

          <p className="SettingsLinks">
            <Link to={`/${profile.username}`}>View profile</Link>
            <Link to="/invitations">Invite people</Link>
            <Link to="/onboarding">Launch on-boarding</Link>
          </p>

          <div className="SettingsPreferences">
            <StreamComponent
              action={availableToggles()}
              ignoresScrollPosition
            />

            {allowNSFWToggle ?
              <div>
                <TreeButton>NSFW</TreeButton>
                <TreePanel>
                  <Preference
                    definition={PREFERENCES.NSFW_VIEW}
                    id="viewsAdultContent"
                    isChecked={profile.viewsAdultContent}
                    onToggleChange={preferenceToggleChanged}
                  />
                  <Preference
                    definition={PREFERENCES.NSFW_POST}
                    id="postsAdultContent"
                    isChecked={profile.postsAdultContent}
                    onToggleChange={this.onTogglePostsAdultContent}
                  />
                  <p><em>{SETTINGS.NSFW_DISCLAIMER}</em></p>
                </TreePanel>
              </div> :
              null}

            {blockedCount > 0 ?
              <div>
                <TreeButton>Blocked users</TreeButton>
                <TreePanel>
                  <StreamComponent
                    action={blockedUsers()}
                    className="BlockedUsers"
                    hasShowMoreButton
                    paginatorText="See more"
                    ignoresScrollPosition
                  />
                </TreePanel>
              </div> :
              null}

            {mutedCount > 0 ?
              <div>
                <TreeButton>Muted users</TreeButton>
                <TreePanel>
                  <StreamComponent
                    action={mutedUsers()}
                    className="MutedUsers"
                    hasShowMoreButton
                    paginatorText="See more"
                    ignoresScrollPosition
                  />
                </TreePanel>
              </div> :
              null}

            <TreeButton>Your Data</TreeButton>
            <TreePanel>
              <p className="SettingsDataDescription">{SETTINGS.YOUR_DATA_DESC}</p>
              <dl className="SettingsDefinitionValues">
                <dt>Username:</dt>
                <dd>{`@${profile.username}`}</dd>
                <dt>Name:</dt>
                <dd>{profile.name || mdash}</dd>
                <dt>Short Bio:</dt>
                <dd>{profile.shortBio || mdash}</dd>
                <dt>Links:</dt>
                <dd>
                  {!isEmpty(profile.externalLinksList) ?
                    this.getExternalLinkListAsText() :
                    mdash}
                </dd>
                <dt>Avatar:</dt>
                <dd>{this.getOriginalAssetUrl(profile.avatar)}</dd>
                <dt>Header:</dt>
                <dd>{this.getOriginalAssetUrl(profile.coverImage)}</dd>
              </dl>
              <div className="SettingsCell">
                <dl className="SettingsDefinition">
                  <dt>Export Data</dt>
                  <dd>
                    This includes all of the content you have posted on Ello.
                    We will email you a link to download your data.
                  </dd>
                </dl>
                {profile.dataExport ?
                  <a
                    className="SettingsButton"
                    href={profile.dataExport}
                    target="_blank"
                  >
                    Download Export
                  </a> :
                  <button
                    className="SettingsButton"
                    onClick={this.onClickRequestDataExport}
                    ref="exportButton"
                  >
                    Request Export
                  </button>
                }
              </div>
            </TreePanel>

            <TreeButton>Account Deletion</TreeButton>
            <TreePanel>
              <div className="SettingsCell">
                <dl className="SettingsDefinition">
                  <dt>
                    <span>{SETTINGS.ACCOUNT_DELETION_DEFINITION.term}</span>
                    <Emoji
                      name="wave"
                      title="Sad wave"
                      style={{ marginTop: `-${5 / 16}rem`, marginLeft: `${5 / 16}rem` }}
                    />
                  </dt>
                  <dd>{SETTINGS.ACCOUNT_DELETION_DEFINITION.desc}</dd>
                  <button
                    className="SettingsButton asDangerous"
                    onClick={this.onClickDeleteAccountModal}
                  >
                    Delete
                  </button>
                </dl>
              </div>
            </TreePanel>
          </div>
        </div>
      </MainView>
    )
  }
}

function mapStateToProps(state) {
  return {
    availability: state.profile.availability,
    blockedCount: state.profile.blockedCount || 0,
    coverDPI: state.gui.coverDPI,
    coverOffset: state.gui.coverOffset,
    isCoverHidden: state.gui.isCoverHidden,
    mutedCount: state.profile.mutedCount || 0,
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(Settings)

