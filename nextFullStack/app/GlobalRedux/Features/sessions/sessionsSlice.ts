// src/app/GlobalRedux/Features/sessions/sessionsSlice.ts

import { Session } from '@/utils/functions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: [] as Session[],
  reducers: {
    setSessions: (state, action: PayloadAction<Session[]>) => {
      return action.payload;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.unshift(action.payload);
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.findIndex(session => session.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setSessions, addSession, updateSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;