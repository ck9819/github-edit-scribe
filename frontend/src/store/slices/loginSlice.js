import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }, thunkAPI) => {
  try {
    
    const response = await axios.post('http://localhost:5000/login', { username, password });
    localStorage.setItem('token', response.data.token);
     
    return jwtDecode(response.data.token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('token');
});

const loginSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default loginSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const loginSlice = createSlice({
//   name: 'user',
//   initialState: { token: null, status: null },
//   reducers: {
//     loginSuccess: (state, action) => {
//       state.token = action.payload;
//       state.status = 'success';
//     },
//     loginFailure: (state) => {
//       state.status = 'failure';
//     },
//   },
// });

// export default loginSlice.reducer;
// export const { loginSuccess, loginFailure } = loginSlice.actions;

