import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, CheckSquare, TrendingUp, Clock, ChevronRight, Plus } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

// Mock data
const taskCompletionData = [
  { name: 'Week 1', completed: 23, overdue: 3 },
  { name: 'Week 2', completed: 28, overdue: 2 },
  { name: 'Week 3', completed: 25, overdue: 5 },
  { name: 'Week 4', completed: 30, overdue: 4 },
];

const clientConversionData = [
  { name: 'Jan', leads: 25, converted: 10 },
  { name: 'Feb', leads: 30, converted: 12 },
  { name: 'Mar', leads: 28, converted: 15 },
  { name: 'Apr', leads: 35, converted: 18 },
  { name: 'May', leads: 32, converted: 20 },
  { name: 'Jun', leads: 40, converted: 25 },
];

const teamMembers = [
  { id: '1', name: 'John Smith', position: 'Software Developer', taskCompletion: 92, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', name: 'Sarah Johnson', position: 'Marketing Specialist', taskCompletion: 87, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '3', name: 'Michael Brown', position: 'Financial Analyst', taskCompletion: 95, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '4', name: 'Emily Wilson', position: 'UI/UX Designer', taskCompletion: 80, avatar: 'https://i.pravatar.cc/150?img=8' },
];

const recentTasks = [
  { id: '1', title: 'Complete website redesign', priority: 'High', dueDate: '2023-10-25', status: 'In Progress', assignee: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '2', title: 'Prepare Q3 marketing report', priority: 'Medium', dueDate: '2023-10-20', status: 'To Do', assignee: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '3', title: 'Client presentation for Project X', priority: 'High', dueDate: '2023-10-18', status: 'In Progress', assignee: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=7' },
];

const ManagerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [timeRange, setTimeRange] = useState('month');
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
            <h1 className="text-2xl font-bold text-neutral-900">Manager Dashboard</h1>
            <p className="text-neutral-500">
              Welcome back, {user?.name}! Here's your team's progress overview.
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
              <p className="text-neutral-500 text-sm">Team Members</p>
              <h3 className="text-2xl font-bold text-neutral-900">12</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>1 new member</span>
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
                <span>5 new leads</span>
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
                <span>93% on time</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start">
            <div className="p-3 rounded-md bg-warning-100 text-warning-700">
              <TrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-neutral-500 text-sm">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-neutral-900">62%</h3>
              <p className="text-xs text-success-600 flex items-center mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                </svg>
                <span>5% increase</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Task Completion</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskCompletionData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar name="Completed" dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Overdue" dataKey="overdue" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Client Conversion</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientConversionData} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#6b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
                <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-primary-50 border border-primary-100">
          <h3 className="text-lg font-medium text-primary-900 mb-3">Manage Tasks</h3>
          <p className="text-sm text-primary-700 mb-4">Create, assign, or review tasks.</p>
          <div className="flex space-x-2">
            <Link to="/tasks/create" className="btn-primary text-sm py-1.5">
              <Plus size={16} className="mr-1" />
              Create Task
            </Link>
            <Link to="/tasks/board" className="btn-outline text-sm py-1.5 text-primary-700 border-primary-200">
              Task Board
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
          <h3 className="text-lg font-medium text-success-900 mb-3">Performance</h3>
          <p className="text-sm text-success-700 mb-4">Review team performance metrics.</p>
          <div className="flex space-x-2">
            <Link to="/reports/dashboard" className="btn text-sm py-1.5 bg-success-600 text-white hover:bg-success-700">
              <TrendingUp size={16} className="mr-1" />
              View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-neutral-900">Team Performance</h3>
          <Link to="#" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
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
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">Task Completion</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{member.position}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-neutral-900">{member.taskCompletion}%</div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${member.taskCompletion >= 90 ? 'bg-success-500' :
                            member.taskCompletion >= 75 ? 'bg-primary-500' :
                              'bg-warning-500'
                            }`}
                          style={{ width: `${member.taskCompletion}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <button className="text-xs text-primary-700 bg-primary-100 hover:bg-primary-200 px-2 py-1 rounded mr-1">
                      Assign Task
                    </button>
                    <button className="text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Tasks & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Recent Tasks</h3>
            <Link to="/tasks/board" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              View all
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start p-3 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50">
                <div className="mr-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={task.avatar} alt={task.assignee} className="h-full w-full object-cover" />
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
                    <div className="flex items-center">
                      <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 mr-2 ${getStatusBadgeColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-neutral-500">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {task.assignee}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                <p className="text-sm font-medium text-neutral-900">Team Meeting</p>
                <p className="text-xs text-neutral-500">Tomorrow, 10:00 AM - 11:30 AM</p>
              </div>
            </div>

            <div className="flex items-start p-3 rounded-lg border border-accent-100 bg-accent-50">
              <div className="p-2 rounded-md bg-accent-100 text-accent-700">
                <Building2 size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Client Presentation</p>
                <p className="text-xs text-neutral-500">Oct 20, 2023, 2:00 PM - 3:30 PM</p>
              </div>
            </div>

            <div className="flex items-start p-3 rounded-lg border border-success-100 bg-success-50">
              <div className="p-2 rounded-md bg-success-100 text-success-700">
                <TrendingUp size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Quarterly Performance Review</p>
                <p className="text-xs text-neutral-500">Oct 28, 2023, 9:00 AM - 12:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;