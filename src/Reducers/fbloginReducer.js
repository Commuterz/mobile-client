import { FB_LOGIN_REQUEST,FB_LOGIN_SUCCESS,FB_LOGIN_FAILURE,LOGIN,LOGOUT} from '@lib/constants'
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';


const initialState = {
  data: {},
  sessionToken: "",
  isLoggedIn: false,
  isFetching: false,
  dataFetched: false,
  error: false
}

export default function dataReducer(state = initialState, action)
{
  switch (action.type) {
    case FB_LOGIN_REQUEST:
      return {
        ...state,
        data: {},
        isFetching: trues
      }
    case FB_LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      }
    case FB_LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true
      }
    default:
      return state
  }
}
