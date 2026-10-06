// ==========================================
// BUỔI 3: REDUX TOOLKIT - STORE CONFIGURATION
// Cấu hình store trung tâm với Redux Toolkit và xuất RootState, AppDispatch
// ==========================================

import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
