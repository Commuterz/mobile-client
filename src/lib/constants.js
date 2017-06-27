import {Platform} from 'react-native';

export const FETCHING_DATA = 'FETCHING_DATA'

// TO GET USER LIST
export const SIGN_IN_USER = 'SIGN_IN_USER'
export const SIGN_IN_USER_SUCCESS = 'SIGN_IN_USER_SUCCESS'
export const SIGN_IN_USER_FAILURE = 'SIGN_IN_USER_FAILURE'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export const FB_LOGIN_REQUESTT = 'FB_LOGIN_REQUEST'
export const FB_LOGIN_SUCCESS = 'FB_LOGIN_SUCCESS'
export const FB_LOGIN_FAILURE = 'FB_LOGIN_FAILURE'


// TO SIGNUP USER
export const SIGN_UP_USER = 'SIGN_UP_USER'
export const SIGN_UP_USER_SUCCESS = 'SIGN_UP_USER_SUCCESS'
export const SIGN_UP_USER_FAILURE = 'SIGN_UP_USER_FAILURE'

export const addProfileJSON ='http://52.170.217.85:3000/addjson';
export const getProfileData = 'http://52.170.217.85:3000/catjson';

export const statusBarColor = Platform.OS === 'android'? '#0c7cd5':'white'
