import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Calendar, Filter, TrendingUp, Users, Building2, CheckSquare, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

// Mock data for charts
const employeeGrowthData = [
  { month: 'Jan', count: 120 },
  { month: 'Feb', count: 125 },
  { month: 'Mar', count: 130 },
  { month: 'Apr', count: 128 },
  { month: 'May', count: 135 },
  { month: 'Jun', count: 142 },
];

const departmentDistribution = [
  { name: 'IT', value: 35 },
  { name: 'HR', value: 15 },
  { name: 'Marketing', value: 20 },
  { name: 'Sales', value: 25 },
  { name: 'Finance', value: 15 },
];

const attendanceData = [
  { date: 'Mon', present: 95, absent: 5, late: 8 },
  { date: 'Tue', present: 92, absent: 8, late: 5 },
  { date: 'Wed', present: 97, absent: 3, late: 4 },
  { date: 'Thu', present: 94, absent: 6, late: 7 },
  { date: 'Fri', present: 90, absent: 10, late: 6 },
];

const taskCompletionData = [
  { month: 'Jan', completed: 45, pending: 15 },
  { month: 'Feb', completed: 52, pending: 12 },
  { month: 'Mar', completed: 48, pending: 18 },
  { month: 'Apr', completed: 55, pending: 10 },
  { month: 'May', completed: 50, pending: 14 },
  { month: 'Jun', completed: 58, pending: 8 },
];

const COLORS = ['#6b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];

const ReportsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reports Dashboard</h1>
          <p className="text-neutral-500">Analytics and insights about your organization</p>
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
          <Link to="/reports/export" className="btn-outline">
            <Download size={18} className="mr-1" />
            Export Reports
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-primary-100 text-primary-700">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Total Employees</p>
              <h3 className="text-2xl font-bold text-neutral-900">142</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                <span>12% increase</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-accent-100 text-accent-700">
              <Building2 size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Active Clients</p>
              <h3 className="text-2xl font-bold text-neutral-900">38</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                <span>8% increase</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-success-100 text-success-700">
              <CheckSquare size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Tasks Completed</p>
              <h3 className="text-2xl font-bold text-neutral-900">258</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                <span>24% increase</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-warning-100 text-warning-700">
              <DollarSign size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Total Payroll</p>
              <h3 className="text-2xl font-bold text-neutral-900">$236.2K</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                <span>5% increase</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Employee Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Employee Growth</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employeeGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#6b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Department Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Weekly Attendance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Present" dataKey="present" fill="#10b981" />
                <Bar name="Absent" dataKey="absent" fill="#ef4444" />
                <Bar name="Late" dataKey="late" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Task Completion</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Completed" dataKey="completed" fill="#6b82f6" />
                <Bar name="Pending" dataKey="pending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50 cursor-pointer">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Employee Report</h3>
            <p className="text-sm text-neutral-500 mb-4">Complete employee data and statistics</p>
            <button className="btn-outline text-sm py-1 w-full">
              <Download size={16} className="mr-1" />
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50 cursor-pointer">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Attendance Report</h3>
            <p className="text-sm text-neutral-500 mb-4">Detailed attendance and leave records</p>
            <button className="btn-outline text-sm py-1 w-full">
              <Download size={16} className="mr-1" />
              Export CSV
            </button>
          </div>

          <div className="p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50 cursor-pointer">
            <h3 className="text-sm font-medium text-neutral-900 mb-2">Performance Report</h3>
            <p className="text-sm text-neutral-500 mb-4">Task completion and productivity metrics</p>
            <button className="btn-outline text-sm py-1 w-full">
              <Download size={16} className="mr-1" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;