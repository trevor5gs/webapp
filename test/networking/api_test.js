import { expect } from '../spec_helper'
import * as api from '../../src/networking/api'

describe('api.js', () => {
  it('#s3CredentialsPath', () => {
    expect(api.s3CredentialsPath().path).to.match(/\/assets\/credentials$/)
    expect(api.s3CredentialsPath().pagingPath).to.be.undefined
  })

  it('#profilePath', () => {
    expect(api.profilePath().path).to.match(/\/profile$/)
    expect(api.profilePath().pagingPath).to.be.undefined
  })

  it('#awesomePeoplePath', () => {
    expect(api.awesomePeoplePath().path).to.match(/\/discover\/users\/onboarding\?/)
    expect(api.awesomePeoplePath().pagingPath).to.be.undefined
  })

  it('#communitiesPath', () => {
    expect(api.communitiesPath().path).to.match(/\/interest_categories\/members\?/)
    expect(api.communitiesPath().pagingPath).to.be.undefined
  })

  it('#relationshipBatchPath', () => {
    expect(api.relationshipBatchPath().path).to.match(/\/relationships\/batches$/)
  })

  it('#discoverRecommended', () => {
    expect(api.discoverRecommended().path).to.match(/\/discover\/users\/recommended\?/)
    expect(api.discoverRecommended().params.include_recent_posts).to.be.true
    expect(api.discoverRecommended().pagingPath).to.be.undefined
  })

  it('#friendStream', () => {
    expect(api.friendStream().path).to.match(/\/streams\/friend\?/)
    expect(api.friendStream().pagingPath).to.be.undefined
  })

  it('#noiseStream', () => {
    expect(api.noiseStream().path).to.match(/\/streams\/noise\?/)
    expect(api.noiseStream().pagingPath).to.be.undefined
  })

  it('#postDetail', () => {
    expect(api.postDetail('~666').path).to.match(/\/posts\/~666\?/)
    expect(api.postDetail('666').pagingPath).to.equal('comments')
  })


  it('#commentsForPost', () => {
    expect(api.commentsForPost({ id: 'what' }).path).to.match(/\/posts\/what\/comments\?/)
    expect(api.commentsForPost({ id: 'what' }).pagingPath).to.be.undefined
  })

  it('#userDetail', () => {
    expect(api.userDetail('~666').path).to.match(/\/users\/~666\?/)
    expect(api.userDetail('666').pagingPath).to.equal('posts')
  })

  it('#searchPosts', () => {
    expect(api.searchPosts({ terms: 'blah' }).path).to.match(/\/posts\?terms=blah/)
    expect(api.searchPosts({ terms: 'blah' }).pagingPath).to.be.undefined
  })

  it('#searchUsers', () => {
    expect(api.searchUsers({ terms: 'blah' }).path).to.match(/\/users\?terms=blah/)
    expect(api.searchUsers({ terms: 'blah' }).pagingPath).to.be.undefined
  })
})

