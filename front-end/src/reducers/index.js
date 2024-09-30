import {combineReducers} from '@reduxjs/toolkit'
import authReducer from '../slices/AuthSlice';
import profileReducer from '../slices/ProfileSlice'
import cartReducer from '../slices/CartSlice'
const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer
})
export default rootReducer;