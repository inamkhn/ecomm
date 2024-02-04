import { combineReducers,configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import cartSlice from './slices/cartSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import orderSlice from './slices/orderSlice';

const rootReducer = combineReducers({ userState:userSlice,cartState:cartSlice,orderState:orderSlice });

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store);