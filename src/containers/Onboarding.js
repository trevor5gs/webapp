import React from 'react'
import { connect } from 'react-redux'
import UserView from '../components/UserView'

export default class Onboarding extends React.Component {
  render() {
    return (
      <UserView className='onboarding'/>
    )
  }
}

