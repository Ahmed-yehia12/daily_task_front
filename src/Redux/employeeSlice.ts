import { AlertError, AlertSuccess } from '@/helpers';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the structure of employee data
interface Employee {
  id?: string; // Optional because the ID might not be sent during creation
  name: string;
  position: string;
}

// Define the state structure
interface EmployeeData {
  docs: Employee[]; // Array of Employee objects
  isLoading: boolean;
  isError: boolean;
  message?: string; // Optional message for feedback
}

const initialState: EmployeeData = {
  docs: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Async thunk to fetch employees
export const getEmployees = createAsyncThunk<Employee[], void>(
  'employeeSlice/getEmployees',
  async () => {
    const response = await axios.get<Employee[]>(
      `https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net/api/v1/employee`
    );
    return response.data; // Return the array of employees
  }
);

// Async thunk to add a new employee
export const addEmployee = createAsyncThunk<Employee, Employee>(
  'employeeSlice/addEmployee',
  async (employee) => {
    console.log(employee)
    const response = await axios.post<Employee>(
      `https://daily-tasks-abgrfkh7a8a7hdez.westeurope-01.azurewebsites.net/api/v1/employee/create_employee`,
      employee
    );
    return response.data; // Return the created employee
  }
);

// Employee slice
const employeeSlice = createSlice({
  name: 'employeeSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get employees
    builder
      .addCase(getEmployees.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.docs = action.payload; // Update the employee list
        state.isLoading = false;

      })
      .addCase(getEmployees.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    // Add employee
    builder
      .addCase(addEmployee.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(addEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        AlertSuccess("created succesfuly") // You will see `from` and `to` in ISO format

        state.docs.push(action.payload); // Add the new employee to the list
        state.isLoading = false;
        state.message = 'Employee added successfully!';

      })
      .addCase(addEmployee.rejected, (state) => {
         AlertError("plz enter valid data")
        
        state.isLoading = false;
        state.isError = true;
        state.message = 'Failed to add employee.';
      });
  },
});

// Export the reducer
export const employeeReducer = employeeSlice.reducer;
