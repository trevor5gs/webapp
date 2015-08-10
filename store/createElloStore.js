import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { callAPIMiddleware } from '../middleware/callAPIMiddleware';
import * as reducers from '../reducers';

const createStoreWithMiddleware = applyMiddleware(thunk, callAPIMiddleware)(createStore);
const reducer = combineReducers(reducers);

export default function createElloStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}

// fetch('stubbed_data/communities.json').then(
//   response => { return response.json() },
//   error => console.log(error)
// );

// fetch('stubbed_data/awesome_people.json')
//   .then(function(response) {
//     return response.json()
//   }).then(function(json) {
//     console.log('parsed json', json)
//   }).catch(function(ex) {
//     console.log('parsing failed', ex)
//   })
