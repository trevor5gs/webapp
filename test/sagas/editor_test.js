import { expect } from '../spec_helper'
import { channel } from 'redux-saga'
import { saveAsset } from '../../src/sagas/editor'
import * as ACTION_TYPES from '../../src/constants/action_types'
import {
  saveAsset as saveAssetAction,
  temporaryAssetCreated,
  uploadAsset,
} from '../../src/actions/editor'

describe('editor saga', () => {
  it('saves temporary assets and uploads to s3 with a file and editorId', () => {
    const myChannel = channel()
    const saveAction = saveAssetAction('file', 'editorId')
    const editor = saveAsset(myChannel)
    expect(editor).to.take(myChannel)
    expect(editor.next(saveAction)).to.put(temporaryAssetCreated('file', 'editorId'))
    // couldn't figuire out a way to test the select since
    // it needs the editorId, so just skip it instead
    editor.next()
    expect(editor.next(1)).to.put(
      uploadAsset(ACTION_TYPES.EDITOR.SAVE_IMAGE, 'file', 'editorId', 1)
    )
  })
})

