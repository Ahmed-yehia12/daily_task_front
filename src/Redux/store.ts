import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { employeeReducer } from './employeeSlice';
import { tasksReducer } from './tasksSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    employee: employeeReducer,
    tasks: tasksReducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Export the store
export default store;
