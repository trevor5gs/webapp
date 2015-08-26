import { test, isFSA, hasStreamMetadata } from '../spec_helper'
import * as subject from '../../src/actions/onboarding'

test('#loadChannels', (assert) => {
  const action = subject.loadChannels()
  assert.true(isFSA(action), 'should contain FSA properties')
  assert.true(hasStreamMetadata(action), 'should have stream metadata')
  assert.equal(action.type, 'LOAD_STREAM')
  assert.equal(action.payload.endpoint, '/test/mock/data/channels.json')
  assert.deepEqual(action.payload.vo, {})
  assert.equal(action.meta.mappingType, 'users')
  assert.equal(typeof action.meta.renderStream, 'function')
  assert.end()
})

test('#loadAwesomePeople', (assert) => {
  const action = subject.loadAwesomePeople()
  assert.true(isFSA(action), 'should contain FSA properties')
  assert.true(hasStreamMetadata(action), 'should have stream metadata')
  assert.equal(action.type, 'LOAD_STREAM')
  assert.equal(action.payload.endpoint, '/test/mock/data/awesome_people.json')
  assert.deepEqual(action.payload.vo, {})
  assert.equal(action.meta.mappingType, 'users')
  assert.equal(typeof action.meta.renderStream, 'function')
  assert.end()
})

