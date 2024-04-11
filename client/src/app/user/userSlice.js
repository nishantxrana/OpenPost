import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    error:null,
    loading:false
}

const signinSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startLogin:(state)=>{
            state.loading = true
            state.error = null
            state.currentUser = null
        },
        login: (state, action) => {
            state.loading = false
            state.error = null
            state.currentUser = action.payload
        },
        loginError: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true
            state.error = null
        },
        updateSuccess: (state, action) => {
            state.loading = false
            state.currentUser.rest = action.payload
            state.error = null
        },
        updateError: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

 export const {startLogin,login,loginError,updateStart,updateSuccess,updateError} = signinSlice.actions;

export default signinSlice.reducer