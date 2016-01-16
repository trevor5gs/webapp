import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { pushPath } from 'redux-simple-router'
import debounce from 'lodash.debounce'
import * as ACTION_TYPES from '../../constants/action_types'
import { PREFERENCES, SETTINGS } from '../../constants/gui_types'
import { openModal, closeModal, openAlert } from '../../actions/modals'
import { availableToggles, saveCover, saveAvatar, saveProfile } from '../../actions/profile'
import AdultPostsDialog from '../../components/dialogs/AdultPostsDialog'
import BioControl from '../../components/forms/BioControl'
import EmailControl from '../../components/forms/EmailControl'
import FormButton from '../../components/forms/FormButton'
import LinksControl from '../../components/forms/LinksControl'
import NameControl from '../../components/forms/NameControl'
import PasswordControl from '../../components/forms/PasswordControl'
import UsernameControl from '../../components/forms/UsernameControl'
import Preference from '../../components/forms/Preference'
import Uploader from '../../components/uploaders/Uploader'
import Avatar from '../../components/assets/Avatar'
import Cover from '../../components/assets/Cover'
import TreeButton from '../../components/navigation/TreeButton'
import StreamComponent from '../../components/streams/StreamComponent'
import { preferenceToggleChanged } from '../../components/base/junk_drawer'


class Settings extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isInfoFormSaving: false,
    }
  }

  componentWillMount() {
    this.saveInfoForm = debounce(this.saveInfoForm, 300)
  }

  onLogOut() {
    const { dispatch } = this.props
    dispatch({ type: ACTION_TYPES.AUTHENTICATION.LOGOUT })
    dispatch(pushPath('/', window.history.state))
  }

  getExternalLinkListAsText() {
    const { profile } = this.props
    return (
      profile.externalLinksList.map((link, i) => {
        return (
          <a
            href={link.url}
            target="_blank"
            key={ 'settingslinks_' + i }
            style={{ marginRight: `${5 / 16}rem` }}
          >
            { link.text }
          </a>
        )
      })
    )
  }

  getOriginalAssetUrl(asset) {
    return (
    asset && asset.original && asset.original.url ?
      <a href={ asset.original.url } target="_blank">View original image</a> :
      <span>&mdash;</span>
    )
  }

  handleControlChange() {
  }

  saveInfoForm(vo) {
    const { isInfoFormSaving } = this.state
    if (!isInfoFormSaving) {
      this.setState({ isInfoFormSaving: true })
    }
    this.props.dispatch(saveProfile(vo))
  }

  handleInfoControlChanged(vo) {
    this.saveInfoForm(vo)
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  closeModal() {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  launchAdultPostsPrompt(obj) {
    if (obj.postsAdultContent) {
      const { dispatch, profile } = this.props
      dispatch(openModal(
        <AdultPostsDialog
          onConfirm={ ::this.closeModal }
          user={ profile }
        />
      ))
    }
    preferenceToggleChanged(obj)
  }

  render() {
    const { profile, dispatch } = this.props
    if (!profile) {
      return null
    }

    const { isInfoFormSaving } = this.state
    const mdash = <span>&mdash;</span>
    const boxControlClassNames = 'asBoxControl onWhite isOriginalValue'

    return (
      <section className="Settings Panel">
        <div className="SettingsCoverPicker">
          <Uploader
            title="Upload a header image"
            message="Or drag & drop"
            recommend="Recommended image size: 2560 x 1440"
            openAlert={ bindActionCreators(openAlert, dispatch) }
            saveAction={ bindActionCreators(saveCover, dispatch) }
          />
          <Cover isModifiable coverImage={ profile.coverImage } />
        </div>
        <button className="SettingsLogoutButton" onClick={ ::this.onLogOut }>Logout</button>
        <div className="SettingsBody" >
          <div className="SettingsAvatarPicker" >
            <Uploader
              title="Pick an Avatar"
              message="Or drag & drop it"
              recommend="Recommended image size: 360 x 360"
              openAlert={ bindActionCreators(openAlert, dispatch) }
              saveAction={ bindActionCreators(saveAvatar, dispatch) }
            />
            <Avatar
              isModifiable
              size="large"
              sources={ profile.avatar }
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
            onSubmit={this.handleSubmit}
            role="form"
          >
            <UsernameControl
              classModifiers={ boxControlClassNames }
              controlWasChanged={::this.handleControlChange}
              tabIndex="1"
              text={ profile.username }
            />
            <EmailControl
              classModifiers={ boxControlClassNames }
              controlWasChanged={::this.handleControlChange}
              tabIndex="2"
              text={ profile.email }
            />
            <PasswordControl
              classModifiers={ boxControlClassNames }
              controlWasChanged={::this.handleControlChange}
              placeholder="Set a new password"
              tabIndex="3"
            />
            <div className="SettingsCredentialActions">
              <PasswordControl
                classModifiers={ boxControlClassNames }
                controlWasChanged={::this.handleControlChange}
                placeholder="Enter current password"
              />
              <p>
                To save changes to [ password ] you must re-enter your current Ello
                password.
              </p>
              <FormButton disabled>Save</FormButton>
            </div>
          </form>

          <form
            className="SettingsForm"
            noValidate="novalidate"
            onSubmit={this.handleSubmit}
            role="form"
          >
            <NameControl
              classModifiers={ boxControlClassNames }
              controlWasChanged={ ::this.handleInfoControlChanged }
              tabIndex="4"
              text={profile.name || null}
            />
            <BioControl
              classModifiers={ boxControlClassNames }
              controlWasChanged={ ::this.handleInfoControlChanged }
              tabIndex="5"
              text={profile.shortBio || null}
            />
            <LinksControl
              classModifiers={ boxControlClassNames }
              controlWasChanged={ ::this.handleInfoControlChanged }
              tabIndex="6"
              text={
                profile.externalLinksList ?
                profile.externalLinksList.map((link) => { return link.text }).join(', ') :
                [].join()
              }
            />
            <span
              className="SettingsInfoFormStatus"
              style={{ opacity: isInfoFormSaving ? 1 : 0 }}
            >
              Profile updated successfully
            </span>
          </form>

          <p className="SettingsLinks">
            <Link to={ `/${profile.username}` }>View profile</Link>
            <Link to="/invitations">Invite people</Link>
            <Link to="/onboarding">Launch on-boarding</Link>
          </p>

          <div className="SettingsPreferences">
            <StreamComponent ref="streamComponent" action={availableToggles()} />

            <TreeButton>NSFW</TreeButton>
            <div className="TreePanel">
              <Preference
                definition={ PREFERENCES.NSFW_VIEW }
                id="viewsAdultContent"
                isChecked={ profile.viewsAdultContent }
                onToggleChange={ preferenceToggleChanged }
              />
              <Preference
                definition={ PREFERENCES.NSFW_POST }
                id="postsAdultContent"
                isChecked={ profile.postsAdultContent }
                onToggleChange={ ::this.launchAdultPostsPrompt }
              />
              <p><em>{ SETTINGS.NSFW_DISCLAIMER }</em></p>
            </div>

            <TreeButton>Muted/Blocked</TreeButton>
            <div className="TreePanel">
              <p>
                <img src="/static/images/support/hot_shit.png" width="20" height="20"/>
              </p>
            </div>

            <TreeButton>Your Data</TreeButton>
            <div className="TreePanel">
              <p>{ SETTINGS.YOUR_DATA_DESC}</p>
              <dl className="SettingsDefinitionValues">
                <dt>Username:</dt>
                <dd>{ `@${profile.username}` }</dd>
                <dt>Name:</dt>
                <dd>{ profile.name || mdash }</dd>
                <dt>Short Bio:</dt>
                <dd>{ profile.shortBio || mdash }</dd>
                <dt>Links:</dt>
                <dd>{ profile.externalLinksList ? this.getExternalLinkListAsText() : mdash }</dd>
                <dt>Avatar:</dt>
                <dd>{ this.getOriginalAssetUrl(profile.avatar) }</dd>
                <dt>Header:</dt>
                <dd>{ this.getOriginalAssetUrl(profile.coverImage) }</dd>
              </dl>
              <div className="SettingsCell">
                <dl className="SettingsDefinition">
                  <dt>Export Data</dt>
                  <dd>
                    This includes all of the content you have posted on Ello.
                    We will email you a link to download your data.
                  </dd>
                </dl>
                { profile.dataExport && profile.dataExport.value ?
                  <a className="SettingsButton" href={profile.export}>Download Export</a> :
                  <a className="SettingsButton" href="/export">Request Export</a>
                }
              </div>
            </div>

            <TreeButton>Account Deletion</TreeButton>
            <div className="TreePanel">
              <div className="SettingsCell">
                  <dl className="SettingsDefinition">
                    <dt>
                      <span>{ SETTINGS.ACCOUNT_DELETION_DEFINITION.term }</span>
                      <img
                        alt=":wave:"
                        title=":wave:"
                        src="/static/images/support/wave.png"
                        style={{ marginTop: `-${5 / 16}rem`, marginLeft: `${5 / 16}rem` }}
                        width="20"
                        height="20"
                      />
                    </dt>
                    <dd>{SETTINGS.ACCOUNT_DELETION_DEFINITION.desc}</dd>
                    <button className="SettingsButton asDangerous">Delete</button>
                  </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
// TODO: Should this load profile or will the App take care of it?
// Settings.preRender = (store) => {
//   return store.dispatch(loadProfile())
// }

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  profile: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(Settings)

