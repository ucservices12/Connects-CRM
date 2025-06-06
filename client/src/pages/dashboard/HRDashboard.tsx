import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, FileText, Briefcase, Clock, ChevronRight, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

// Mock data
const attendanceData = [
  { name: 'Mon', present: 95, absent: 5, late: 10 },
  { name: 'Tue', present: 92, absent: 8, late: 6 },
  { name: 'Wed', present: 96, absent: 4, late: 5 },
  { name: 'Thu', present: 94, absent: 6, late: 8 },
  { name: 'Fri', present: 90, absent: 10, late: 12 },
];

const departmentData = [
  { name: 'IT', value: 35 },
  { name: 'HR', value: 15 },
  { name: 'Marketing', value: 20 },
  { name: 'Sales', value: 25 },
  { name: 'Finance', value: 15 },
];

const COLORS = ['#6b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];

const leaveRequests = [
  { id: '1', employeeName: 'John Smith', department: 'IT', type: 'Annual Leave', from: '2023-10-20', to: '2023-10-25', status: 'Pending', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', employeeName: 'Sarah Johnson', department: 'Marketing', type: 'Sick Leave', from: '2023-10-22', to: '2023-10-23', status: 'Pending', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '3', employeeName: 'Michael Brown', department: 'Finance', type: 'Emergency Leave', from: '2023-10-21', to: '2023-10-22', status: 'Pending', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const HRDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [timeRange, setTimeRange] = useState('week');
  const today = new Date();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">HR Dashboard</h1>
            <p className="text-neutral-500">
              Welcome back, {user?.name}! Here's what needs your attention today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-input py-1 px-3 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
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
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Total Employees</p>
              <h3 className="text-2xl font-bold text-neutral-900">125</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>2 new this week</span>
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
              <p className="text-neutral-500 text-sm">Attendance Today</p>
              <h3 className="text-2xl font-bold text-neutral-900">118</h3>
              <p className="text-xs text-danger-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 13a1 1 0 01-1-1V8.414l-1.293 1.293a1 1 0 11-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L9 8.414V12a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                <span>7 absent</span>
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
              <p className="text-neutral-500 text-sm">Leave Requests</p>
              <h3 className="text-2xl font-bold text-neutral-900">8</h3>
              <p className="text-xs text-warning-600 flex items-center mt-1">
                <span className="block h-3 w-3 rounded-full bg-warning-500 mr-1"></span>
                <span>3 pending approval</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-warning-100 text-warning-700">
              <Briefcase size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Salary Processing</p>
              <h3 className="text-2xl font-bold text-neutral-900">15</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>Due in 5 days</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Weekly Attendance</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-sm bg-primary-500 mr-1"></span>
                <span className="text-neutral-500">Present</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-sm bg-danger-500 mr-1"></span>
                <span className="text-neutral-500">Absent</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-sm bg-warning-500 mr-1"></span>
                <span className="text-neutral-500">Late</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill="#6b82f6" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" />
                <Bar dataKey="late" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Department Distribution</h3>
          </div>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
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
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-primary-50 border border-primary-100">
          <h3 className="text-lg font-medium text-primary-900 mb-3">Manage Employees</h3>
          <p className="text-sm text-primary-700 mb-4">Add, edit, or review employee profiles.</p>
          <div className="flex space-x-2">
            <Link to="/employees/add" className="btn-primary text-sm py-1.5">
              <Plus size={16} className="mr-1" />
              Add Employee
            </Link>
            <Link to="/employees" className="btn-outline text-sm py-1.5 text-primary-700 border-primary-200">
              View All
            </Link>
          </div>
        </div>

        <div className="card bg-accent-50 border border-accent-100">
          <h3 className="text-lg font-medium text-accent-900 mb-3">Leave Management</h3>
          <p className="text-sm text-accent-700 mb-4">Review and process leave requests.</p>
          <div className="flex space-x-2">
            <Link to="/leaves/requests" className="btn text-sm py-1.5 bg-accent-600 text-white hover:bg-accent-700">
              Pending Requests
            </Link>
            <Link to="/leaves/history" className="btn-outline text-sm py-1.5 text-accent-700 border-accent-200">
              History
            </Link>
          </div>
        </div>

        <div className="card bg-success-50 border border-success-100">
          <h3 className="text-lg font-medium text-success-900 mb-3">Salary Management</h3>
          <p className="text-sm text-success-700 mb-4">Process and view salary records.</p>
          <div className="flex space-x-2">
            <Link to="/salary/generate" className="btn text-sm py-1.5 bg-success-600 text-white hover:bg-success-700">
              Generate Salary
            </Link>
            <Link to="/salary/list" className="btn-outline text-sm py-1.5 text-success-700 border-success-200">
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-neutral-900">Pending Leave Requests</h3>
          <Link to="/leaves/requests" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
            View all
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img src={request.avatar} alt={request.employeeName} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-neutral-900">{request.employeeName}</div>
                        <div className="text-xs text-neutral-500">{request.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{request.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                    {format(new Date(request.from), 'MMM dd')} - {format(new Date(request.to), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800 px-2 py-1">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <button className="text-xs text-success-700 bg-success-100 hover:bg-success-200 px-2 py-1 rounded mr-1">
                      Approve
                    </button>
                    <button className="text-xs text-danger-700 bg-danger-100 hover:bg-danger-200 px-2 py-1 rounded">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-neutral-900">Upcoming Events</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start p-3 rounded-lg border border-primary-100 bg-primary-50">
            <div className="p-2 rounded-md bg-primary-100 text-primary-700">
              <Clock size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">Monthly Review Meeting</p>
              <p className="text-xs text-neutral-500">Tomorrow, 10:00 AM - 11:30 AM</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg border border-accent-100 bg-accent-50">
            <div className="p-2 rounded-md bg-accent-100 text-accent-700">
              <Users size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">New Employee Orientation</p>
              <p className="text-xs text-neutral-500">Oct 25, 2023, 9:00 AM - 11:00 AM</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg border border-success-100 bg-success-50">
            <div className="p-2 rounded-md bg-success-100 text-success-700">
              <Briefcase size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-900">Salary Processing Deadline</p>
              <p className="text-xs text-neutral-500">Oct 28, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;