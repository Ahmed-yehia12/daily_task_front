import { AlertError, AlertSuccess } from '@/helpers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the structure of Task data
interface Task {
  id?: string; // Optional because the ID might not be sent during creation
  description: string;
  employeeId: string;
  from: string;
  to: string;
}
interface Hours {
    id?: string; // Optional because the ID might not be sent during creation
    totalHours: string;
    remainingHours: string;
  }
  
// Define the state structure
interface TasksData {
  docs: Task[]; 
  tasks: Task[];// Array of Tasks objects
  isLoading: boolean;
  isError: boolean;
  message?: string; 
  hours?:Hours;// Optional message for feedback
}

const initialState: TasksData = {
  docs: [],
  tasks: [],
  isLoading: false,
  isError: false,
  message: '',
  hours:{
    totalHours: '',
    remainingHours: '',
  },

};

// Async thunk to fetch task
export const getTasksForEmployee = createAsyncThunk<Task[], void>(
  'tasksSlice/getTasksForEmployee',
  async (id) => {
    const response = await axios.get<Task[]>(
      `https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net//api/v1/tasks/${id}`
    );
    return response.data; // Return the array of employees
  }
);

export const getTasks = createAsyncThunk<Task[], void>(
    'tasksSlice/getTasks', // Unique name for the action
    async () => {
      const response = await axios.get<Task[]>('https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net//api/v1/tasks');
      return response.data; // Ensure the API returns an array of tasks
    }
  );

  
  export const getRemainingHours = createAsyncThunk<Hours, { employeeId: string }>(
    'tasksSlice/getRemainingHours',
    async ({ employeeId }) => {
      console.log("Sending request for remaining hours", employeeId);
      const response = await axios.post<Task[]>(
        'https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net//api/v1/tasks/daily_summry',
        { employeeId } // Pass the data in the body
      );
      return response.data;
    }
  );
export const deleteTask = createAsyncThunk<Task[], string>(
    'tasksSlice/deleteTask',
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.delete<Task[]>(
          `https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net//api/v1/tasks/${id}`
        );
        return response.data; // Return updated tasks or confirmation
      } catch (error) {
        // Handle error appropriately
        if (axios.isAxiosError(error) && error.response) {
          return rejectWithValue(error.response.data); // Reject with error details
        }
        return rejectWithValue('An unexpected error occurred');
      }
    }
  );
  
  export const updateTask = createAsyncThunk<
  Task[], 
  { id: string; values: Partial<Task> } // Accept object with `id` and `values`
>(
  'tasksSlice/updateTask',
  async ({ id, values }, { rejectWithValue }) => {
    try {
      console.log("from slice", id, values);
      const response = await axios.put<Task[]>(
        `https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net//api/v1/tasks/${id}`,
        values // Send updated values in the request body
      );
      return response.data; // Return updated tasks or confirmation
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data); // Reject with error details
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Async thunk to add a new Task
export const addTask = createAsyncThunk<Task, Task>(
  'tasksSlice/addTask',
  async (task) => {
    console.log(task)
    const response = await axios.post<Task>(
      `https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net//api/v1/tasks/create_task`,
      task
    );
    return response.data; // Return the created Task
  }
);

// Employee slice
const tasksSlice = createSlice({
  name: 'tasksSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get employees
    builder
      .addCase(getTasksForEmployee.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTasksForEmployee.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.docs = action.payload; // Update the Task list
        state.isLoading = false;
      })
      .addCase(getTasksForEmployee.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    // Add Task
    builder
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
      AlertSuccess("created succesfuly") // You will see `from` and `to` in ISO format
        
        state.docs.push(action.payload); // Add the new Task to the list
        state.isLoading = false;
        state.message = 'Employee added successfully!';
      })
      .addCase(addTask.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = 'Failed to add Task.';
      });
// update task
      builder
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
       AlertSuccess("Task updated succesfuly") // You will see `from` and `to` in ISO format

        state.docs.push(action.payload); // Add the new Task to the list
        state.isLoading = false;
        state.message = 'Employee added successfully!';
      })
      .addCase(updateTask.rejected, (state) => {
        AlertError("plz enter valid data")
        state.isLoading = false;
        state.isError = true;
        state.message = 'Failed to add Task.';
      });
      builder
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<Task>) => {
        AlertSuccess("Deleted succesfuly") // You will see `from` and `to` in ISO format
        state.docs.push(action.payload); // Add the new Task to the list
        state.isLoading = false;
        state.message = 'Employee added successfully!';
      })
      .addCase(deleteTask.rejected, (state) => {
        AlertError("you can't delete this task")
        state.isLoading = false;
        state.isError = true;
        state.message = 'Failed to add Task.';
      });
      builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload; // Replace the task list
        state.isLoading = false;
      })
      .addCase(getTasks.rejected, (state) => {
        AlertError("Plz enter valid data")
        state.isLoading = false;
        state.isError = true;
        state.message = 'Failed to fetch tasks.';
      });
      builder
      .addCase(getRemainingHours.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getRemainingHours.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.hours = action.payload; // Replace the task list
        state.isLoading = false;
      })
      .addCase(getRemainingHours.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.message = 'Failed to fetch tasks.';
      });


  },
});

// Export the reducer
export const tasksReducer = tasksSlice.reducer;
