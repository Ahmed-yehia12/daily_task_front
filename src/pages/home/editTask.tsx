import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/Redux/store';
import { getEmployees } from '@/Redux/employeeSlice';
import { updateTask } from '@/Redux/tasksSlice';

interface EditTaskFormValues {
  description: string;
  employeeId: string;
  from: string;
  to: string;
}
interface EditTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedTask: EditTaskFormValues;
}

export const EditTask: React.FC<EditTaskProps> = ({ open, setOpen, selectedTask }) => {
  const employees = useSelector((state: RootState) => state.employee.docs.data);
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: EditTaskFormValues = {
    description: selectedTask.description,
    employeeId: '',
    from: '',
    to: '',
  };
  useEffect(() => {
    if (selectedTask) {
      formik.resetForm({
        values: {
          description: selectedTask.description,
          employeeId: selectedTask.employeeId._id,
          from: selectedTask.from,
          to: selectedTask.to,
        },
      });
    }
  }, [selectedTask]);
  useEffect(() => {
    dispatch(getEmployees());
  }, []);
  const formik = useFormik<EditTaskFormValues>({
    initialValues,
    onSubmit: (values) => {
      dispatch(updateTask({ id: selectedTask._id, values }));
      setOpen(false);
    },
  });
  const handleDateChange = (date: Date | null, field: keyof EditTaskFormValues) => {
    if (date) {
      formik.setFieldValue(field, date.toISOString());
    } else {
      formik.setFieldValue(field, '');
    }
  };
  return (
    <Drawer open={open} direction="right" onOpenChange={setOpen}>
      <DrawerContent>
        <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">My Form</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="input1">
                Description
              </label>
              <input
                id="description"
                type="text"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Enter Description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="select">
                Select Employee
              </label>
              <select
                id="employeeId"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {employees?.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start-date">
                Start Date and Time
              </label>
              <DatePicker
                selected={formik.values.from ? new Date(formik.values.from) : null}
                onChange={(date) => handleDateChange(date, 'from')} // Type-safe change handler
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15} // Time selection intervals (e.g., 15 minutes)
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start date and time"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mt-4 mb-2" htmlFor="end-date">
                End Date and Time
              </label>
              <DatePicker
                selected={formik.values.to ? new Date(formik.values.to) : null}
                onChange={(date) => handleDateChange(date, 'to')} // Type-safe change handler
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select end date and time"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
