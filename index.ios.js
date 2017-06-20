/*
import React, { AppRegistry } from 'react-native';
import App from './app/js/app';

AppRegistry.registerComponent('Commuterz', () => App);
*/

import React from 'react'
import {
  AppRegistry
} from 'react-native'
global.Buffer = global.Buffer || require('buffer').Buffer;

import App from './src/app'
AppRegistry.registerComponent('Commuterz', () => App);
