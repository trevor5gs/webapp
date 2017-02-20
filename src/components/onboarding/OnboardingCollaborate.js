// @flow
import React from 'react'
import OnboardingNavbar from './OnboardingNavbar'
import Preference from '../forms/Preference'
import { MainView } from '../views/MainView'

type PreferenceType = {
  desc: string,
  id: string,
  term: string,
}

type Props = {
  onToggleChange: Function,
  prefs: Array<PreferenceType>,
}

const OnboardingCollaborate = (props: Props) =>
  <MainView className="Onboarding OnboardingCollaborate">
    <div className="OnboardingPreferences">
      {props.prefs.map(pref =>
        <Preference
          className="OnboardingPreference"
          definition={{ term: pref.term, desc: pref.desc }}
          id={pref.id}
          key={`preference_${pref.id}`}
          onToggleChange={props.onToggleChange}
        />,
      )}
    </div>
    <OnboardingNavbar />
  </MainView>

export default OnboardingCollaborate

