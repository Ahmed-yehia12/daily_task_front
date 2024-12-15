import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { getEmployees, addEmployee } from '@/Redux/employeeSlice';
import { useFormik } from 'formik';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
interface AddNewEmployeeProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
interface EmployeeForm {
  name: string;
  date: string;
}
const initialValues: EmployeeForm = {
  name: '',
  date: '',
};
export const AddNewEmployee: React.FC<AddNewEmployeeProps> = ({ open, setOpen }) => {
  const employees = useSelector((state) => console.log(state.employee));
  const dispatch = useDispatch();
  const formik = useFormik<EmployeeForm>({
    initialValues,
    onSubmit: (values) => {
      dispatch(addEmployee(values));
      formik.resetForm();
      setOpen(false);
    },
  });
  const handleDateChange = (date: Date | null, field: keyof EmployeeForm) => {
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange} // Standard Formik handler
                placeholder="Enter text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <DatePicker
                selected={formik.values.date ? new Date(formik.values.date) : null}
                onChange={(date) => handleDateChange(date, 'date')} // Update Formik on change
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start date and time"
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
