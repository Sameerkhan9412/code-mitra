import { createSlice } from "@reduxjs/toolkit";
const initialState={
    totalItems:localStorage.getItem("totalItems")?JSON.parse(localStorage.getItem("totalItems")):0
}
const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        setTotalItems(state,value){
            state.value=value.payload
        },
        // add to cart
        // remove from cart
        // resetCart
    }
})
export const {setTotalItems}=cartSlice.actions;
export default cartSlice.reducer 