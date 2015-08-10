export function loadCommunities() {
  console.log('yo')
  return {
    types: ['LOAD_COMMUNITIES_REQUEST', 'LOAD_COMMUNITIES_SUCCESS', 'LOAD_COMMUNITIES_FAILURE'],
    shouldCallAPI: true,
    callAPI: () => fetch(`stubbed_data/communities.json`),
    payload: {}
  };
}
