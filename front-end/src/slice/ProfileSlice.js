import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:null
}

const profileSlice=createSlice({
    name:"Profile",
    initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
        }
    }
})

export const {setUser}=profileSlice.actions;
export default profileSlice.reducer;