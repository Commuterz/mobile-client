import {Actions} from 'react-native-router-flux'
import { AccessToken, LoginManager,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';
import { FETCHING_DATA, FB_LOGIN_REQUEST,FB_LOGIN_SUCCESS,FB_LOGIN_FAILURE} from '@lib/constants'

export function getData() {
  return {
    type: FETCHING_DATA
  }
}
export function fbLoginError(error){
  return  {
    type: FB_LOGIN_FAILURE,
    error
  };
};

export function fbLoginSuccess(data)
{
  return{
    type: FB_LOGIN_SUCCESS,
    data
  }
};

export function onFBLogin()
{
  return dispatch => {
    var self =this;
    getStoredAccessToken().then(accessToken =>
      {
        if(accessToken)
        {
            const responseInfoCallback = (error, result) =>
            {
                if (error) {
                      alert('Error fetching data: ' + error.toString());
                      dispatch(fbLoginError("Error fetching data:" +error.toString()));
                } else {
                    //alert('Success fetching data: ' + JSON.stringify(result));
                    dispatch(fbLoginSuccess(result));
              }
            }
            const infoRequest = new GraphRequest('/me', {
              accessToken: accessToken,
              parameters: {
                fields: {
                  string: 'email,name,id,picture'
                }
              }
              }, responseInfoCallback);
            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start()
        }
        else
        {
            dispatch(fbLoginError("Cannot get accessToken"));
            alert("Cannot get access token");
            dispatch(logOut())
        }
    });
  }
}


export function getStoredAccessToken()
{
    return AccessToken.getCurrentAccessToken().then(currentAccessToken => {
      if(currentAccessToken)
      {
        let accessToken = currentAccessToken.accessToken;
        return accessToken;
      }
      else {
        return null;
      }
    });
}

export function logOut()
{
  return dispatch =>{
    LoginManager.logOut()
  }
}
