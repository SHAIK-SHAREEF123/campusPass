// frontend/redux/outpassSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  outpasses: [], // list of all outpasses for the student or caretaker
  loading: false,
  error: null,
};

const outpassSlice = createSlice({
  name: "outpass",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setOutpasses(state, action) {
      state.outpasses = action.payload;
    },
    addOutpass(state, action) {
      state.outpasses.push(action.payload);
    },
    updateOutpass(state, action) {
      const index = state.outpasses.findIndex(
        (o) => o._id === action.payload._id
      );
      if (index !== -1) {
        state.outpasses[index] = action.payload;
      }
    },
    removeOutpass(state, action) {
      state.outpasses = state.outpasses.filter(
        (o) => o._id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setError,
  setOutpasses,
  addOutpass,
  updateOutpass,
  removeOutpass,
} = outpassSlice.actions;

export default outpassSlice.reducer;
