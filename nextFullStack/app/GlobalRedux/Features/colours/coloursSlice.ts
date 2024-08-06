import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Colour {
  // Define your user type here
  colourLight: string;
  colourMid:string
  colourDark:string
  colourDarkest:string
  colourText:string
  colourBlack:string
  themeDark:boolean
  // Add other user properties
}


const initialState: Colour = {
    colourLight:'',
    colourMid:'',
    colourDark:'',
    colourDarkest:'',
    colourText:'',
    colourBlack:'',
    themeDark:true,
};

const colourSlice = createSlice({
  name: 'colour',
  initialState,
  reducers: {
    setDark: (state) => {
        state.colourBlack = '';
        state.colourLight='';
        state.colourMid='';
        state.colourDark='';
        state.colourDarkest='';
        state.colourText='';
        state.colourBlack='';
        state.themeDark=true;
    },
    setLight: (state) => {
        state.colourBlack = '';
        state.colourLight='';
        state.colourMid='';
        state.colourDark='';
        state.colourDarkest='';
        state.colourText='';
        state.colourBlack='';
        state.themeDark=false;
    },
    
  },
});

export const { setLight, setDark} = colourSlice.actions;


export default colourSlice.reducer;