import * as types from './actionTypes';

const initialState = {
  status: null,
  data: [],
  dataFetched: false,
  isFetching: false,
  error: false

};

export default function home(state = initialState, action) {
  switch (action.type) {
    case types.HOME_REQUEST:
      return {
        ...state,
        data: [],
        isFetching: true,
        status: 'home_request',
      };
    case types.HOME_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.data,
        status: 'home_success',
      };
    case types.HOME_ERROR:
      return {
        ...state,
        isFetching: false,
        error: true,
        status: 'home_error',
      };
    default:
      return state;
  }
}
