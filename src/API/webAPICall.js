
import {Alert} from 'react-native';

let WebAPICall =
{
  async postApiWithJosnData(serverUrl,jsonData,methodType){
      var response = await  fetch(serverUrl, {method: methodType, headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },body: jsonData})

       let responseJson = await response.json();
       return responseJson

  },
  async getApi(serverUrl,methodType){

       var response = await  fetch(serverUrl, {method: methodType})
       let responseJson = await response.json();
       return responseJson
  },

postApiWithJosnDataInMainThread(serverUrl,jsonData,methodType){
   return fetch(serverUrl, {method: methodType, headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },body: jsonData})
   .then((response) => response.json())
   .then((responseJson) => { return responseJson; })
   .catch((error) => { Alert.alert("Failure","Something went wrong." +error) });
 },

getApiInMainThread(serverUrl,methodType){
      return  fetch(serverUrl, {method: methodType})
      .then((response) => response.json())
      .then((responseJson) => { return responseJson; })
      .catch((error) => {  Alert.alert("Failure","Something went wrong." +error)});
 },
};

module.exports = WebAPICall
