import { expect } from './spec_helper'
import * as api from '../src/api'

describe('api.js', () => {
  it('.communitiesPath', () => {
    expect(api.communitiesPath).to.equal('https://ello-staging.herokuapp.com/api/v2/interest_categories/members?name=onboarding&per_page=20')
  })

  it('.awesomePeoplePath', () => {
    expect(api.awesomePeoplePath).to.equal('https://ello-staging.herokuapp.com/api/v2/discover/users/onboarding?per_page=20')
  })

  it('.relationshipBatchPath', () => {
    expect(api.relationshipBatchPath).to.equal('https://ello-staging.herokuapp.com/api/v2/relationships/batches')
  })

  it('.profilePath', () => {
    expect(api.profilePath).to.equal('https://ello-staging.herokuapp.com/api/v2/profile')
  })

  it('.s3CredentialsPath', () => {
    expect(api.s3CredentialsPath).to.equal('https://ello-staging.herokuapp.com/api/v2/assets/credentials')
  })
})

