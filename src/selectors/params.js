/* eslint-disable import/prefer-default-export */
import { get } from 'lodash'

// props.params.xxx
export const selectParamsToken = (state, props) => {
  const token = get(props, 'params.token')
  return token ? token.toLowerCase() : null
}
export const selectParamsType = (state, props) => get(props, 'params.type')
export const selectParamsUsername = (state, props) => get(props, 'params.username')

export const selectInvitationCode = (state, props) => get(props, 'params.invitationCode')

// Memoized selectors

