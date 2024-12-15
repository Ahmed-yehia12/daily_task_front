import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { getEmployees } from '@/Redux/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/Redux/store';
import { addTask } from '@/Redux/tasksSlice';
import { AlertSuccess } from '@/helpers';

interface TaskFormValues {
  description: string;
  employeeId: string;
  from: string;
  to: string;
}

const initialValues: TaskFormValues = {
  description: '',
  employeeId: '',
  from: '',
  to: '',
};

interface AddNewTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const AddNewTask: React.FC<AddNewTaskProps> = ({ open, setOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.employee.docs.data);

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  const formik = useFormik<TaskFormValues>({
    initialValues,
    onSubmit: (values) => {
      console.log(values);
      dispatch(addTask(values));
      formik.resetForm();
      setOpen(false);
    },
  });

  const handleDateChange = (date: Date | null, field: keyof TaskFormValues) => {
    if (date) {
      formik.setFieldValue(field, date.toISOString()); // Update Formik's state with ISO string
    } else {
      formik.setFieldValue(field, ''); // Clear the field if the date is null
    }
  };

  return (
    <Drawer open={open} direction="right" onOpenChange={setOpen}>
      <DrawerContent>
        <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">My Form</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange} // Standard Formik handler
                placeholder="Enter text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeId">
                Select Employee
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formik.values.employeeId}
                onChange={formik.handleChange} // Standard Formik handler
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {employees?.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="from">
                Start Date and Time
              </label>
              <DatePicker
                selected={formik.values.from ? new Date(formik.values.from) : null}
                onChange={(date) => handleDateChange(date, 'from')} // Update Formik on change
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start date and time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="to">
                End Date and Time
              </label>
              <DatePicker
                selected={formik.values.to ? new Date(formik.values.to) : null}
                onChange={(date) => handleDateChange(date, 'to')} // Update Formik on change
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select end date and time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <Button type="submit" className="w-full rounded-full my-8">
              Submit
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNewTask;
