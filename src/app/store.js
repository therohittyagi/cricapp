import { configureStore } from '@reduxjs/toolkit';
import videoReducer from '../features/videoTrimming/videoSlice';

export const store = configureStore({
  reducer: {
    video: videoReducer,
  },
});

export default store;
