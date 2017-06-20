
import React, {Component} from 'react';
import { Provider,connect } from 'react-redux';
import { Actions, Router, Scene } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen'
import {View, Platform,AsyncStorage} from 'react-native';

import configureStore from '@lib/configureStore'
import Login from '@Containers/login';
import SignUp from '@Containers/signUp';
import VerifyPhone from '@Containers/verifyPhone';
import Home from '@Containers/homeMap';

const ConnectedRouter = connect()(Router)
const store = configureStore();

const Scenes = Actions.create(
  <Scene key='root'>
    <Scene key='login' component={Login} title='Login'/>
    <Scene key='signUp' component={SignUp} title='SignUp' />
    <Scene key='verifyPhone' component={VerifyPhone} title='VerifyPhone' />
    <Scene key='home' component={Home} title='Home' />
  </Scene>
)

export default class App extends Component {
  constructor(props) {
    super(props);
    if(Platform.OS =='android'){
        SplashScreen.hide();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter hideNavBar={ true } scenes={Scenes}/>
      </Provider>
    )
  }
}
