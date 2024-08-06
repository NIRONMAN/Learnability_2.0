'use client'

import { createSlice } from "@reduxjs/toolkit"

export interface CounterState {
    value:string,
    file:any
}

const initialState: CounterState = {
    value: 'hidden',
    file:null
}

export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        showPdf: (state) => {state.value = ""},
        hidePdf:(state) => {state.value = 'hidden'},
        setPdf:(state,action)=>{state.file = action.payload},
    }
})

export const {setPdf,hidePdf,showPdf} = counterSlice.actions

export default counterSlice.reducer