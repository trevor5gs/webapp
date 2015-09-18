import { expect } from './spec_helper'
import * as api from '../src/api'

describe('api.js', () => {
  it('.communitiesPath', () => {
    expect(api.communitiesPath).to.equal('https://ello-staging.herokuapp.com/api/v2/interest_categories/members?name=onboarding&per_page=20')
  })
})

