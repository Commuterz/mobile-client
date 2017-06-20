import React, { Component } from 'react';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';
import * as reducers from './reducers';
import SplashScreen from 'react-native-splash-screen'
import {View, Platform} from 'react-native';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import Home from './home/containers/home';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="Home" component={ Home } />
  </Scene>
);

export default class App extends Component {
  constructor(props) {
    super(props);
    SplashScreen.hide();

  }

  render() {
   return (
      <Provider store={ store }>
        <Router hideNavBar={ true } scenes={ scenes }/>
      </Provider>
    );
  }
}
