
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch sales enquiry by ID
export const fetchSalesEnquiry = createAsyncThunk('sales/fetchSalesEnquiry', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`http://localhost:5000/getsales/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchAllSalesEnquiry = createAsyncThunk('sales/fetchAllSalesEnquiry', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`http://localhost:5000/getallsales`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    enquiry: [],
    allEnquiries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesEnquiry.fulfilled, (state, action) => {
        state.enquiry = action.payload;
        state.loading = false;
      })
      .addCase(fetchSalesEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSalesEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSalesEnquiry.fulfilled, (state, action) => {
        state.allEnquiries = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllSalesEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default salesSlice.reducer;
