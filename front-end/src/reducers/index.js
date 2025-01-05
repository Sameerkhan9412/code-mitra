import {combineReducers} from '@reduxjs/toolkit'
import authReducer from '../slices/AuthSlice';
import profileReducer from '../slices/ProfileSlice'
import cartReducer from '../slices/CartSlice'
import courseReducer from '../slices/courseSlice'
import viewCourseReducer from "../slices/ViewCourseSlice"
const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})
export default rootReducer;