import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PREFERENCES, SETTINGS } from '../../constants/gui_types'
import { openModal, closeModal } from '../../actions/modals'
import { availableToggles } from '../../actions/profile'
import AdultPostsDialog from '../../components/dialogs/AdultPostsDialog'
import BioControl from '../../components/forms/BioControl'
import EmailControl from '../../components/forms/EmailControl'
import LinksControl from '../../components/forms/LinksControl'
import NameControl from '../../components/forms/NameControl'
import PasswordControl from '../../components/forms/PasswordControl'
import UsernameControl from '../../components/forms/UsernameControl'
import Preference from '../../components/forms/Preference'
// import Uploader from '../../components/uploaders/Uploader'
import Avatar from '../../components/assets/Avatar'
import Cover from '../../components/assets/Cover'
import TreeButton from '../../components/navigation/TreeButton'
import StreamComponent from '../../components/streams/StreamComponent'
import { preferenceToggleChanged } from '../../components/base/junk_drawer'


class Settings extends Component {

  getAvatarSource() {
    const { profile } = this.props
    const { avatar, tmpAvatar } = profile
    if (tmpAvatar) {
      return tmpAvatar
    }
    return avatar ? avatar.large.url : null
  }

  getCoverSource() {
    const { profile } = this.props
    const { coverImage, tmpCover } = profile
    if (tmpCover) {
      return tmpCover
    }
    return coverImage ? coverImage : null
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
    const { profile } = this.props
    const mdash = <span>&mdash;</span>
    if (!profile) {
      return null
    }
    return (
      <section className="Settings Panel">
        <Cover isModifiable coverImage={this.getCoverSource()} />
        <div className="SettingsBody" >
          <div className="SettingsAvatarPicker" >
          <Avatar
            isModifiable
            size="large"
            sources={this.getAvatarSource()}
          />
          </div>

          <header className="SettingsHeader">
            <h1 className="SettingsHeading">Profile</h1>
            <p>
              Your username, name, bio and links appear on your public Ello
              profile. Your email address remains private.
            </p>
          </header>

          <form className="SettingsForm">
            <UsernameControl
              classModifiers="asBoxControl onWhite"
              controlWasChanged={::this.handleControlChange}
              tabIndex="1"
            />
            <EmailControl
              classModifiers="asBoxControl onWhite"
              controlWasChanged={::this.handleControlChange}
              tabIndex="2"
            />
            <PasswordControl
              classModifiers="asBoxControl onWhite"
              controlWasChanged={::this.handleControlChange}
              tabIndex="3"
            />
            <NameControl
              classModifiers="asBoxControl onWhite"
              controlWasChanged={::this.handleControlChange}
              tabIndex="4"
            />
            <BioControl
              classModifiers="asBoxControl onWhite"
              controlWasChanged={::this.handleControlChange}
              tabIndex="5"
            />
            <LinksControl
              classModifiers="asBoxControl onWhite"
              controlWasChanged={::this.handleControlChange}
              tabIndex="6"
            />
          </form>

          <p className="SettingsLinks">
            <Link to="/">View Profile</Link>
            <Link to="/onboarding">Launch On-boarding</Link>
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
// TODO: Should this load profile?
// Settings.preRender = (store) => {
//   return store.dispatch(loadInvitedUsers())
// }

Settings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  profile: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    profile: state.profile.payload,
  }
}

export default connect(mapStateToProps)(Settings)

