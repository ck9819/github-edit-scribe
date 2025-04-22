import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllItems, getItemId} from '../api/index'

export const fetchItems = createAsyncThunk('fetchItems', async () => {
  const response = await fetchAllItems();

  return response.data;
});

export const fetchItemId = createAsyncThunk('/fetchItemsId', async () => {
    const response = await getItemId();
    return response.data;
  });


const itemSlice = createSlice({
  name: 'items',
  initialState: {
    loading: false,
    myitems: [],
    itemid: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.myitems = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default itemSlice.reducer;
