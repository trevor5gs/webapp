export function loadCommunities() {
  return {
    type: 'LOAD_COMMUNITIES',
    payload: { endpoint: `/_data/communities.json`, vo: {} }
  }
}

export function loadAwesomePeople() {
  return {
    type: 'LOAD_AWESOME_PEOPLE',
    payload: { endpoint: `/_data/awesome_people.json`, vo: {} }
  }
}

