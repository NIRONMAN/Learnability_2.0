import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

interface User {
  // Define your user type here
  userId: string;
  displayName:string
  email:string
  // Add other user properties
}

interface AuthState {
  user: User | null;
  changeScene: boolean;
  isLoadingCookie: boolean;
}

const initialState: AuthState = {
  user: null,
  changeScene: false,
  isLoadingCookie: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      setCookie('user', JSON.stringify(action.payload), { maxAge: 7 * 24 * 60 * 60 });
    },
    clearUser: (state) => {
      state.user = null;
      deleteCookie('user');
    },
    setChangeScene: (state) => {
      state.changeScene = !state.changeScene;
    },
    setIsLoadingCookie: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCookie = action.payload;
    },
  },
});

export const { setUser, clearUser, setChangeScene, setIsLoadingCookie } = authSlice.actions;

export const loadUserFromCookies = () => (dispatch: any) => {
  dispatch(setIsLoadingCookie(true));
  const userCookie = getCookie('user');
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie as string);
      dispatch(setUser(user));
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }
  dispatch(setIsLoadingCookie(false));
};

export default authSlice.reducer;