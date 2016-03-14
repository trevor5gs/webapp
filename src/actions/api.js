import { REQUESTER } from '../constants/action_types'

export const pauseRequester = () => ({
  type: REQUESTER.PAUSE,
})

export const unpauseRequester = () => ({
  type: REQUESTER.UNPAUSE,
})

