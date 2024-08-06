'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import { useEffect } from 'react'
import { loadUserFromCookies } from './Features/auth/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadUserFromCookies());
  }, []);

  return <Provider store={store}>{children}</Provider>
}