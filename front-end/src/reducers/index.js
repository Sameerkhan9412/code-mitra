import {combineReducers} from '@reduxjs/toolkit'
import authReducer from '../slice/AuthSlice';
import profileReducer from '../slice/ProfileSlice'
import cartReducer from '../slice/CartSlice'
const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer
})
export default rootReducer;