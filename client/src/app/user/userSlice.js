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
        }
    }
})

export const {startLogin,login,loginError} = signinSlice.actions

export default signinSlice.reducer