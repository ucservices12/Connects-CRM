import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, FileText, Package, Clock, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

// Mock data
const attendanceData = [
  { date: 'Mon', hours: 8.5 },
  { date: 'Tue', hours: 9.0 },
  { date: 'Wed', hours: 8.0 },
  { date: 'Thu', hours: 8.75 },
  { date: 'Fri', hours: 8.25 },
];

const taskStatusData = [
  { name: 'Completed', value: 15 },
  { name: 'In Progress', value: 8 },
  { name: 'To Do', value: 5 },
];

const COLORS = ['#10b981', '#6b82f6', '#f59e0b'];

const leaveBalanceData = [
  { name: 'Jan', balance: 20 },
  { name: 'Feb', balance: 18 },
  { name: 'Mar', balance: 18 },
  { name: 'Apr', balance: 16 },
  { name: 'May', balance: 14 },
  { name: 'Jun', balance: 14 },
  { name: 'Jul', balance: 12 },
  { name: 'Aug', balance: 12 },
  { name: 'Sep', balance: 10 },
  { name: 'Oct', balance: 10 },
];

const myTasks = [
  { id: '1', title: 'Complete monthly report', priority: 'High', dueDate: '2023-10-25', status: 'In Progress' },
  { id: '2', title: 'Update client database', priority: 'Medium', dueDate: '2023-10-20', status: 'To Do' },
  { id: '3', title: 'Submit expense claims', priority: 'Low', dueDate: '2023-10-18', status: 'To Do' },
  { id: '4', title: 'Prepare presentation slides', priority: 'High', dueDate: '2023-10-16', status: 'In Progress' },
];

const announcements = [
  { id: '1', title: 'Office Closure', description: 'The office will be closed on October 31st for system maintenance.', date: '2023-10-12' },
  { id: '2', title: 'New Health Benefits', description: 'New health insurance benefits will be effective from November 1st.', date: '2023-10-10' },
];

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const today = new Date();

  // Priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-danger-100 text-danger-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'low':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'to do':
        return 'bg-neutral-100 text-neutral-800';
      case 'in progress':
        return 'bg-primary-100 text-primary-800';
      case 'review':
        return 'bg-warning-100 text-warning-800';
      case 'done':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Employee Dashboard</h1>
            <p className="text-neutral-500">
              Welcome back, {user?.name}! Here's your personal workspace.
            </p>
          </div>
        </div>
        <div className="mt-2 text-sm text-neutral-500">
          {format(today, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-primary-100 text-primary-700">
              <CheckSquare size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">My Tasks</p>
              <h3 className="text-2xl font-bold text-neutral-900">28</h3>
              <p className="text-xs text-primary-600 flex items-center mt-1">
                <span className="block h-3 w-3 rounded-full bg-primary-500 mr-1"></span>
                <span>8 in progress</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-accent-100 text-accent-700">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Attendance</p>
              <h3 className="text-2xl font-bold text-neutral-900">96%</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>Above average</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-success-100 text-success-700">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Leave Balance</p>
              <h3 className="text-2xl font-bold text-neutral-900">10</h3>
              <p className="text-xs text-neutral-500 flex items-center mt-1">
                <span>Days remaining</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-warning-100 text-warning-700">
              <Package size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">My Assets</p>
              <h3 className="text-2xl font-bold text-neutral-900">3</h3>
              <p className="text-xs text-neutral-500 flex items-center mt-1">
                <span>Items assigned</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Weekly Working Hours</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="hours" fill="#6b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Task Status</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Leave Balance Trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leaveBalanceData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#8b5cf6" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link to="/tasks/my-tasks" className="card card-hover bg-primary-50 border border-primary-100 flex items-center p-4">
          <div className="p-2 rounded-md bg-primary-100 text-primary-700">
            <CheckSquare size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-primary-900">My Tasks</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-primary-500" />
        </Link>

        <Link to="/attendance/mark" className="card card-hover bg-accent-50 border border-accent-100 flex items-center p-4">
          <div className="p-2 rounded-md bg-accent-100 text-accent-700">
            <Calendar size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-accent-900">Mark Attendance</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-accent-500" />
        </Link>

        <Link to="/leaves/apply" className="card card-hover bg-success-50 border border-success-100 flex items-center p-4">
          <div className="p-2 rounded-md bg-success-100 text-success-700">
            <FileText size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-success-900">Apply Leave</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-success-500" />
        </Link>

        <Link to="/assets/my-assets" className="card card-hover bg-warning-50 border border-warning-100 flex items-center p-4">
          <div className="p-2 rounded-md bg-warning-100 text-warning-700">
            <Package size={20} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-warning-900">My Assets</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-warning-500" />
        </Link>
      </div>

      {/* Tasks & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">My Tasks</h3>
            <Link to="/tasks/my-tasks" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            {myTasks.map((task) => (
              <div key={task.id} className="flex items-start p-3 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50">
                <div className="mr-3">
                  <div className={`p-2 rounded-md ${task.status === 'In Progress' ? 'bg-primary-100 text-primary-700' :
                      task.status === 'Done' ? 'bg-success-100 text-success-700' :
                        'bg-neutral-100 text-neutral-700'
                    }`}>
                    <CheckSquare size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                    <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Announcements</h3>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50">
                <h4 className="text-md font-medium text-neutral-900 mb-1">{announcement.title}</h4>
                <p className="text-sm text-neutral-600 mb-2">{announcement.description}</p>
                <p className="text-xs text-neutral-500">
                  {format(new Date(announcement.date), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Upcoming Events</h3>

            <div className="space-y-3">
              <div className="flex items-start p-3 rounded-lg border border-primary-100 bg-primary-50">
                <div className="p-2 rounded-md bg-primary-100 text-primary-700">
                  <Clock size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">Team Meeting</p>
                  <p className="text-xs text-neutral-500">Tomorrow, 10:00 AM - 11:30 AM</p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg border border-accent-100 bg-accent-50">
                <div className="p-2 rounded-md bg-accent-100 text-accent-700">
                  <Calendar size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">Monthly Review</p>
                  <p className="text-xs text-neutral-500">Oct 30, 2023, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;