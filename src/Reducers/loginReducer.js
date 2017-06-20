import { SIGN_IN_USER, SIGN_IN_USER_SUCCESS, SIGN_IN_USER_FAILURE } from '@lib/constants'
const initialLoginState = {
  data: [],
  dataFetched: false,
  isFetching: false,
  error: false
}

export default function dataReducer (state = initialLoginState, action)
{
  switch (action.type) {
    case SIGN_IN_USER:
      return {
        ...state,
        data: [],
        isFetching: true
      }
    case SIGN_IN_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.data
      }
    case SIGN_IN_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true
      }
    default:
      return state
  }
}
