import { configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice';
import companyReducer from './slices/companySlice';
import itemReducer from './slices/itemSlice';
import salesReducer from './slices/salesSlice';
const store = configureStore({
    reducer: {
      user: loginReducer,
      companyData: companyReducer,
      itemData: itemReducer,
      sales: salesReducer,
    },
   
  });
  
  export default store;