import { combineReducers } from 'redux'
import signinResponce from './loginReducer'
import fbLoginResponse from './fbloginReducer'

const rootReducer = combineReducers({
    signinResponce,
    fbLoginResponse
})

export default rootReducer
