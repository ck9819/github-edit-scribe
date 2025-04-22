import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllCompanies} from '../api/index'

export const fetchCompanies = createAsyncThunk(
  'fetchCompanies',
  async () => {

    const response = await (fetchAllCompanies());
    return response.data;
  }
);

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    loading: false,
    companies: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default companySlice.reducer;
