import { stubUser } from '../../support/stubs'
import {
  selectAllowsAnalytics,
  selectAnalyticsId,
  selectAvailability,
  selectAvatar,
  selectBlockedCount,
  selectBuildVersion,
  selectBundleId,
  selectCoverImage,
  selectCreatedAt,
  selectEmail,
  selectExternalLinksList,
  selectHasAvatarPresent,
  selectHasCoverImagePresent,
  selectId,
  selectIsAvatarBlank,
  selectIsCoverImageBlank,
  selectIsInfoFormBlank,
  selectIsPublic,
  selectLinksAsText,
  selectMarketingVersion,
  selectMutedCount,
  selectName,
  selectRegistrationId,
  selectShortBio,
  selectUsername,
  selectWebOnboardingVersion,
} from '../../../src/selectors/profile'

describe('emoji selectors', () => {
  let profile
  beforeEach(() => {
    profile = stubUser({
      allowsAnalytics: true,
      analyticsId: 'analyticsId',
      availability: true,
      blockedCount: 5,
      buildVersion: 'buildVersion',
      bundleId: 'bundleId',
      hasAvatarPresent: true,
      hasCoverImagePresent: true,
      isPublic: true,
      marketingVersion: '1',
      mutedCount: 10,
      registrationId: '1234',
      webOnboardingVersion: '1',
    })
  })

  afterEach(() => {
    profile = {}
  })

  context('#selectAllowsAnalytics', () => {
    it('returns the profile.allowsAnalytics', () => {
      const state = { profile }
      expect(selectAllowsAnalytics(state)).to.equal(true)
    })
  })

  context('#selectAnalyticsId', () => {
    it('returns the profile.analyticsId', () => {
      const state = { profile }
      expect(selectAnalyticsId(state)).to.equal('analyticsId')
    })
  })

  context('#selectAvailability', () => {
    it('returns the profile.availability', () => {
      const state = { profile }
      expect(selectAvailability(state)).to.equal(true)
    })
  })

  context('#selectAvatar', () => {
    it('returns the profile.avatar', () => {
      const state = { profile }
      expect(selectAvatar(state)).to.deep.equal(profile.avatar)
    })
  })

  context('#selectBlockedCount', () => {
    it('returns the profile.blockedCount', () => {
      const state = { profile }
      expect(selectBlockedCount(state)).to.deep.equal(profile.blockedCount)
    })
  })

  context('#selectBuildVersion', () => {
    it('returns the profile.buildVersion', () => {
      const state = { profile }
      expect(selectBuildVersion(state)).to.deep.equal(profile.buildVersion)
    })
  })

  context('#selectBundleId', () => {
    it('returns the profile.bundleId', () => {
      const state = { profile }
      expect(selectBundleId(state)).to.deep.equal(profile.bundleId)
    })
  })

  context('#selectCoverImage', () => {
    it('returns the profile.coverImage', () => {
      const state = { profile }
      expect(selectCoverImage(state)).to.deep.equal(profile.coverImage)
    })
  })

  context('#selectCreatedAt', () => {
    it('returns the profile.createdAt', () => {
      const state = { profile }
      expect(selectCreatedAt(state)).to.deep.equal(profile.createdAt)
    })
  })

  context('#selectEmail', () => {
    it('returns the profile.email', () => {
      const state = { profile }
      expect(selectEmail(state)).to.deep.equal(profile.email)
    })
  })

  context('#selectExternalLinksList', () => {
    it('returns the profile.externalLinksList', () => {
      const state = { profile }
      expect(selectExternalLinksList(state)).to.deep.equal(profile.externalLinksList)
    })
  })

  context('#selectHasAvatarPresent', () => {
    it('returns the profile.hasAvatarPresent', () => {
      const state = { profile }
      expect(selectHasAvatarPresent(state)).to.deep.equal(profile.hasAvatarPresent)
    })
  })

  context('#selectHasCoverImagePresent', () => {
    it('returns the profile.hasCoverImagePresent', () => {
      const state = { profile }
      expect(selectHasCoverImagePresent(state)).to.deep.equal(profile.hasCoverImagePresent)
    })
  })

  context('#selectId', () => {
    it('returns the profile.id', () => {
      const state = { profile }
      expect(selectId(state)).to.deep.equal(profile.id)
    })
  })

  context('#selectIsPublic', () => {
    it('returns the profile.isPublic', () => {
      const state = { profile }
      expect(selectIsPublic(state)).to.deep.equal(profile.isPublic)
    })
  })

  context('#selectMarketingVersion', () => {
    it('returns the profile.marketingVersion', () => {
      const state = { profile }
      expect(selectMarketingVersion(state)).to.deep.equal(profile.marketingVersion)
    })
  })

  context('#selectMutedCount', () => {
    it('returns the profile.mutedCount', () => {
      const state = { profile }
      expect(selectMutedCount(state)).to.deep.equal(profile.mutedCount)
    })
  })

  context('#selectName', () => {
    it('returns the profile.name', () => {
      const state = { profile }
      expect(selectName(state)).to.deep.equal(profile.name)
    })
  })

  context('#selectRegistrationId', () => {
    it('returns the profile.registrationId', () => {
      const state = { profile }
      expect(selectRegistrationId(state)).to.deep.equal(profile.registrationId)
    })
  })

  context('#selectShortBio', () => {
    it('returns the profile.shortBio', () => {
      const state = { profile }
      expect(selectShortBio(state)).to.deep.equal(profile.shortBio)
    })
  })

  context('#selectUsername', () => {
    it('returns the profile.username', () => {
      const state = { profile }
      expect(selectUsername(state)).to.deep.equal(profile.username)
    })
  })

  context('#selectWebOnboardingVersion', () => {
    it('returns the profile.webOnboardingVersion', () => {
      const state = { profile }
      expect(selectWebOnboardingVersion(state)).to.deep.equal(profile.webOnboardingVersion)
    })
  })

  context('#selectIsAvatarBlank', () => {
    it('returns a memoized version of a blank avatar', () => {
      const state = { profile }
      expect(selectIsAvatarBlank(state)).to.equal(false)
      const nextState = { ...state, change: 1 }
      expect(selectIsAvatarBlank(nextState)).to.equal(false)
      expect(selectIsAvatarBlank.recomputations()).to.equal(1)
    })
  })

  context('#selectIsCoverImageBlank', () => {
    it('returns a memoized version of a blank coverImage', () => {
      const state = { profile }
      expect(selectIsCoverImageBlank(state)).to.equal(false)
      const nextState = { ...state, change: 1 }
      expect(selectIsCoverImageBlank(nextState)).to.equal(false)
      expect(selectIsCoverImageBlank.recomputations()).to.equal(1)
    })
  })

  context('#selectIsInfoFormBlank', () => {
    it('returns a memoized version of a blank info form', () => {
      const state = { profile }
      expect(selectIsInfoFormBlank(state)).to.equal(false)
      const nextState = { ...state, change: 1 }
      expect(selectIsInfoFormBlank(nextState)).to.equal(false)
      expect(selectIsInfoFormBlank.recomputations()).to.equal(1)
    })
  })

  context('#selectLinksAsText', () => {
    it('returns a memoized version of a blank info form', () => {
      const state = { profile }
      expect(selectLinksAsText(state)).to.deep.equal('google.com')
      const nextState = { ...state, change: 1 }
      expect(selectLinksAsText(nextState)).to.deep.equal('google.com')
      expect(selectLinksAsText.recomputations()).to.equal(1)
    })
  })
})

