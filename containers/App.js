import React, { Component } from 'react';
import { Provider } from 'react-redux';
import ElloApp from './ElloApp'
import createElloStore from '../store/createElloStore';

const store = createElloStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <ElloApp />}
      </Provider>
    );
  }
}

