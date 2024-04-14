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
        },
        deleteUserStart: (state) => {
            state.loading = true
            state.error = null
        },
        deleteUserSuccess: (state) => {
            state.loading = false
            state.currentUser = null
            state.error = null
        },
        deleteUserError: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logout: (state) => {
            state.loading = false
            state.error = null
            state.currentUser = null
        }
    }
})

 export const {startLogin,login,loginError,updateStart,updateSuccess,updateError,deleteUserStart,deleteUserSuccess,deleteUserError,logout} = signinSlice.actions;

export default signinSlice.reducer