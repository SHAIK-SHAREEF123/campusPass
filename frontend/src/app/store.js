import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice.js';
import outpassReducer from '../redux/outpassSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    outpass: outpassReducer,
    // Add other slices like outpassSlice here
  },
});
