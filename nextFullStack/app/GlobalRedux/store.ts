'use client'

import {configureStore} from '@reduxjs/toolkit'
import counterReducer from './Features/counter/counterSlice'
import stringReducer from "./Features/string/stringSlice"
import sessionsReducer from "./Features/sessions/sessionsSlice"
import authReducer, { loadUserFromCookies } from './Features/auth/authSlice'
import coloursReducer from './Features/colours/coloursSlice'

export const store =configureStore({
    reducer:{
        counter:counterReducer,
        string:stringReducer,
        auth: authReducer,
        sessions:sessionsReducer,
        colour:coloursReducer
    }
})
store.dispatch(loadUserFromCookies());

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch