import React from 'react'
import {
  AppRegistry
} from 'react-native'

import App from './src/app'
global.Buffer = global.Buffer || require('buffer').Buffer;


//import App from './app/js/app';
AppRegistry.registerComponent('Commuterz', () => App);
