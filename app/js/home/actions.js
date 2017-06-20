import * as types from './actionTypes';

export function signUp() {
  return {
    type: [types.SIGNUP_REQUEST, types.SIGNUP_SUCCESS, types.SIGNUP_ERRORE]
  };
}

export function signIn() {
  return {
    type: [types.SIGNIN_REQUEST, types.SIGNIN_SUCCESS, types.SIGNIN_ERRORE]
  };
}

// From Synsoft
export function getRiderBalance() {
  return {
    type: HOME_REQUEST
  }
}

export function getRiderBalanceSuccess(data) {
  return {
    type: HOME_SUCCESS,
    data,
  }
}

export function getRiderBalanceFailure() {
  return {
    type: HOME_ERROR
  }
}


export function fetchData() {

}


export function fetchRiderBalanceDispatcher() {
 return (dispatch) => {
   dispatch(getRiderBalance());
   return fetchRiderBalaceFromAPI().then(([response, json]) =>{
     if(response.status === 200){
       dispatch(getRiderBalanceSuccess(json))
     }
     else{
       dispatch(getRiderBalanceFailure())
     }
   })
 }
}



export function fetchRiderBalaceFromAPI() {
 //  console.warn('fetchRiderBalaceFromAPI');
 //   api.getRiderBalance(function(err,result){
 //       //alert(result);
 //       console.warn("rider balance"+result);
 //   });
 const URL = "https://jsonplaceholder.typicode.com/posts";
 return fetch(URL, { method: 'GET'})
    .then( response => Promise.all([response, response.json()]));
}
