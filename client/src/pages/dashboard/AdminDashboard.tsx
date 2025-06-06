import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CheckSquare, Calendar, FileText, Briefcase, Package, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

// Mock data
const employeeData = [
  { name: 'Jan', count: 12 },
  { name: 'Feb', count: 15 },
  { name: 'Mar', count: 18 },
  { name: 'Apr', count: 20 },
  { name: 'May', count: 23 },
  { name: 'Jun', count: 25 },
  { name: 'Jul', count: 28 },
  { name: 'Aug', count: 30 },
];

const departmentData = [
  { name: 'IT', value: 35 },
  { name: 'HR', value: 15 },
  { name: 'Marketing', value: 20 },
  { name: 'Sales', value: 25 },
  { name: 'Finance', value: 15 },
];

const COLORS = ['#6b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];

const recentEmployees = [
  { id: '1', name: 'John Smith', position: 'Software Developer', department: 'IT', joiningDate: '2023-09-15', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', name: 'Sarah Johnson', position: 'Marketing Specialist', department: 'Marketing', joiningDate: '2023-10-05', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '3', name: 'Michael Brown', position: 'Financial Analyst', department: 'Finance', joiningDate: '2023-10-12', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [timeRange, setTimeRange] = useState('month');
  const today = new Date();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="text-neutral-500">
              Welcome back, {user?.name}! Here's what's happening with your organization today.
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
              <option value="year">This Year</option>
            </select>
            <button className="btn-primary text-sm py-1">
              <TrendingUp size={16} className="mr-1" />
              Reports
            </button>
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
                <span>12% increase</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-accent-100 text-accent-700">
              <Building2 size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Active Clients</p>
              <h3 className="text-2xl font-bold text-neutral-900">38</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>8% increase</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-success-100 text-success-700">
              <CheckSquare size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Tasks Completed</p>
              <h3 className="text-2xl font-bold text-neutral-900">85</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>24% increase</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-warning-100 text-warning-700">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-neutral-900">96%</h3>
              <p className="text-xs text-danger-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 13a1 1 0 01-1-1V8.414l-1.293 1.293a1 1 0 11-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L9 8.414V12a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                <span>2% decrease</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Employee Growth</h3>
            <div className="text-sm text-neutral-500">
              <span className="inline-block w-3 h-3 rounded-sm bg-primary-500 mr-1"></span>
              Total Employees
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6b82f6" radius={[4, 4, 0, 0]} />
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
          <h3 className="text-lg font-medium text-accent-900 mb-3">Manage Clients</h3>
          <p className="text-sm text-accent-700 mb-4">Add, edit, or review client information.</p>
          <div className="flex space-x-2">
            <Link to="/clients/add" className="btn text-sm py-1.5 bg-accent-600 text-white hover:bg-accent-700">
              <Plus size={16} className="mr-1" />
              Add Client
            </Link>
            <Link to="/clients" className="btn-outline text-sm py-1.5 text-accent-700 border-accent-200">
              View All
            </Link>
          </div>
        </div>

        <div className="card bg-success-50 border border-success-100">
          <h3 className="text-lg font-medium text-success-900 mb-3">Manage Tasks</h3>
          <p className="text-sm text-success-700 mb-4">Create, assign, or review tasks.</p>
          <div className="flex space-x-2">
            <Link to="/tasks/create" className="btn text-sm py-1.5 bg-success-600 text-white hover:bg-success-700">
              <Plus size={16} className="mr-1" />
              Create Task
            </Link>
            <Link to="/tasks/board" className="btn-outline text-sm py-1.5 text-success-700 border-success-200">
              Task Board
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Employees & Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Recent Employees</h3>
            <Link to="/employees" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Joining Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {recentEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={employee.avatar} alt={employee.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-neutral-900">{employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{employee.position}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 px-2 py-1">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">
                      {format(new Date(employee.joiningDate), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Quick Links</h3>

          <div className="space-y-4">
            <Link to="/salary/generate" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="p-2 rounded-md bg-primary-100 text-primary-700">
                <Briefcase size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Generate Salary</p>
                <p className="text-xs text-neutral-500">Process monthly salaries</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-neutral-400" />
            </Link>

            <Link to="/leaves/requests" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="p-2 rounded-md bg-accent-100 text-accent-700">
                <FileText size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Leave Requests</p>
                <p className="text-xs text-neutral-500">Review pending requests</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-neutral-400" />
            </Link>

            <Link to="/assets/assign" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="p-2 rounded-md bg-success-100 text-success-700">
                <Package size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Assign Assets</p>
                <p className="text-xs text-neutral-500">Manage company assets</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-neutral-400" />
            </Link>

            <Link to="/reports/dashboard" className="flex items-center p-3 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="p-2 rounded-md bg-warning-100 text-warning-700">
                <TrendingUp size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Reports</p>
                <p className="text-xs text-neutral-500">View performance reports</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-neutral-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;