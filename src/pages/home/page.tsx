import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Plus, Edit, Trash } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AddNewTask } from './addNewTask';
import { EditTask } from './editTask';
import { AddNewEmployee } from './addNewEmployee';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/store'; // Ensure these are correctly defined in your Redux setup
import { getEmployees } from '../../Redux/employeeSlice';
import { deleteTask, getRemainingHours, getTasks, getTasksForEmployee } from '@/Redux/tasksSlice';

interface Task {
  id: string;
  description: string;
  from: Date;
  to: Date;
}

export const HomePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAddEmployee, setOpenAddEmployee] = useState<boolean>(false);
  const [selectedEmoployee, setSelectedEmployee] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [deleted, setDeleted] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const employees = useSelector((state: RootState) => state.employee.docs.data);
  const employeeTasks = useSelector((state: RootState) => state.tasks.docs.data);
  const tasks = useSelector((state: RootState) => state.tasks.tasks.tasks);
  const remainingHours = useSelector((state: RootState) => state.tasks.hours);

  let allTasks;
  if (selectedEmoployee === 'All') {
    allTasks = [...(tasks || [])];
  } else {
    allTasks = [...(employeeTasks || [])];
  }
  function formatDuration(milliseconds) {
    const duration = moment.duration(milliseconds);
    const hours = Math.floor(duration.asHours()); // Get the total hours
    const minutes = duration.minutes(); // Get the remaining minutes
    return { hours, minutes };
  }

  const remaining = formatDuration(remainingHours?.remainingHours);
  const total = formatDuration(remainingHours?.totalHours);

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getTasks());
  }, []);
  useEffect(() => {
    dispatch(getEmployees());
  }, [openAddEmployee]);
  useEffect(() => {
    dispatch(getTasksForEmployee(selectedEmoployee));
    dispatch(getRemainingHours({ employeeId: selectedEmoployee }));
    dispatch(getTasks());
  }, [selectedEmoployee, open, openEdit, deleted]);
  console.log('this is task', employeeTasks);
  const handleDelete = (id) => {
    dispatch(deleteTask(id));
    setDeleted(true);
  };
  return (
    <div className="p-8 w-full min-h-screen flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between flex-1 mb-3">
          <div className="text-3xl font-bold text-black">Tasks</div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center bg-neutral-100 pl-2 pr-3 rounded-full py-2">
              <div className="flex gap-2 items-center">
                <div className="size-6 rounded-full bg-emerald-300" />
                <div className="text-sm whitespace-nowrap max-w-[90px] text-ellipsis overflow-x-hidden">
                  <select
                    onChange={(e) => {
                      setSelectedEmployee(e.target.value);
                    }}
                    // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="All">All</option>
                    {employees?.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Button className="rounded-full p-0 size-8" onClick={() => setOpenAddEmployee(true)}>
              <Plus />
            </Button>
          </div>
        </div>
        <div className="text-md text-neutral-500">
          Welcome to your task management dashboard. Here you can view your tasks, track their
          durations, and manage your daily activities efficiently. Stay organized and make the most
          of your time!
        </div>
        <div className="mt-6">
          {allTasks?.map((item) => (
            <div key={item.id} className="hover:bg-neutral-100 p-3 hover:rounded-2xl pl-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg mb-2">Desc: {item.description}</div>
                  <div className="text-lg mb-2">Employee: {item?.employeeId?.name}</div>

                  <div className="text-sm text-neutral-600">
                    {moment(item.from).format('hh:mm A')} - {moment(item.to).format('hh:mm A')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="p-0 size-10 hover:bg-white"
                    onClick={() => {
                      setOpenEdit(true);
                      setSelectedTask(item);
                    }}>
                    <Edit />
                  </Button>
                  <Button
                    variant="ghost"
                    className="p-0 size-10 hover:bg-white"
                    onClick={(e) => {
                      console.log('this is eee', item._id);
                      handleDelete(item._id);
                    }}>
                    <Trash color="red" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button className="w-full rounded-full my-8" onClick={() => setOpen(true)}>
            Create New Task
          </Button>
          {selectedEmoployee !== 'All' ? (
            <div>
              <div className="flex items-center justify-between mt-8">
                <div>
                  <div className="text-xl text-black">Summary</div>
                  <div className="text-xs opacity-70">{moment().format('Do of MMM, hh:mm A')}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex bg-neutral-100 p-6 rounded-xl flex-col gap-4 flex-1 ">
                  <div className="font-regular text-lg text-neutral-800 ">Remainig duration</div>
                  <div className="flex  justify-center items-center rounded-xl flex-col flex-1">
                    <div className="flex gap-2 text-center">
                      <div className="text-[90px] leading-[90px] font-black ">
                        {remaining.hours}
                        <span className="text-xs text-black uppercase font-bold">hours</span>
                      </div>

                      <div className="text-[90px] font-black leading-[90px] ">
                        {remaining.minutes}
                        <span className="text-xs text-black uppercase font-bold">mins</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex bg-neutral-100 p-6 rounded-xl flex-col gap-4 flex-1 ">
                  <div className="font-regular text-lg text-neutral-800 ">Total tasks duration</div>
                  <div className="flex  justify-center items-center rounded-xl flex-col flex-1">
                    <div className="flex gap-2 text-center">
                      <div className="text-[90px] leading-[90px] font-black">
                        {total.hours}
                        <span className="text-xs text-black uppercase font-bold">hours</span>
                      </div>
                      <div className="text-[90px] font-black leading-[90px] ">
                        {total.minutes}
                        <span className="text-xs text-black uppercase font-bold">mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <AddNewTask open={open} setOpen={setOpen} />
          <EditTask open={openEdit} setOpen={setOpenEdit} selectedTask={selectedTask} />
          <AddNewEmployee open={openAddEmployee} setOpen={setOpenAddEmployee} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
