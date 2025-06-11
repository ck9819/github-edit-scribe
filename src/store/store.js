import { configureStore } from '@reduxjs/toolkit';

// Simplified store - most functionality moved to React Query and Supabase hooks
const store = configureStore({
  reducer: {
    // Keep minimal state here, move data fetching to React Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
