import React from 'react'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import InvitationFormContainer from '../../containers/InvitationFormContainer'

const OnboardingInvitations = () =>
  <MainView className="Onboarding OnboardingInvitations">
    <h1 className="OnboardingHeading">
      <span>Invite some cool people. </span>
      <span>Make Ello better.</span>
    </h1>
    <InvitationFormContainer />
    <OnboardingNavbar />
  </MainView>

export default OnboardingInvitations

