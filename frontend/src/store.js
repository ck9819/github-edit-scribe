import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { token: null, status: null },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.status = 'success';
    },
    loginFailure: (state) => {
      state.status = 'failure';
    },
  },
});

export const { loginSuccess, loginFailure } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;