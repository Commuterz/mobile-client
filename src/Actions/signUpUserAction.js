import { Actions } from 'react-native-router-flux';
import { SIGN_UP_USER,SIGN_UP_USER_SUCCESS,SIGN_UP_USER_FAILURE} from '@lib/constants'

export function getData() {
  return {
    type: SIGN_UP_USER
  }
}

export function getDataSuccess(data)
{
  return {
    type: SIGN_UP_USER_SUCCESS,
    data,
  }
}

export function getDataFailure() {
  return {
    type: SIGN_UP_USER_FAILURE
  }
}

export function dispachSignUpUser()
{
  return (dispatch) => {
    dispatch(getData())
    getUserInfo()
      .then((data) => {
        dispatch(getDataSuccess(data))
      })
      .catch((err) => console.log('err:', err))
  }
}
