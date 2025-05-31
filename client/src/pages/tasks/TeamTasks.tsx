import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Clock, Tag, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';

// Mock tasks data
const tasksData = [
  {
    id: '1',
    title: 'Design new dashboard',
    description: 'Create wireframes and mockups for the new dashboard layout',
    assignee: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    priority: 'high',
    status: 'in progress',
    dueDate: '2023-10-25',
    labels: ['Design', 'UI/UX'],
    comments: 3,
    attachments: 2,
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Add JWT authentication and user roles',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    priority: 'high',
    status: 'todo',
    dueDate: '2023-10-20',
    labels: ['Backend', 'Security'],
    comments: 5,
    attachments: 1,
  },
  {
    id: '3',
    title: 'Update client documentation',
    description: 'Update API documentation with new endpoints',
    assignee: {
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    priority: 'medium',
    status: 'review',
    dueDate: '2023-10-28',
    labels: ['Documentation'],
    comments: 1,
  },
  {
    id: '4',
    title: 'Fix navigation bug',
    description: 'Fix the navigation menu not working on mobile devices',
    assignee: {
      name: 'Emily Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    priority: 'high',
    status: 'todo',
    dueDate: '2023-10-18',
    labels: ['Bug', 'Frontend'],
    comments: 2,
  },
];

const TeamTasks = () => {
  const [tasks] = useState(tasksData);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');

  // Get unique assignees for filter
  const assignees = ['all', ...new Set(tasks.map(task => task.assignee.name))];

  // Get priority badge color
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

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'todo':
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

  // Get label color
  const getLabelColor = (label: string) => {
    const colorMap: Record<string, string> = {
      'Design': 'bg-purple-100 text-purple-800',
      'UI/UX': 'bg-indigo-100 text-indigo-800',
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Security': 'bg-red-100 text-red-800',
      'Documentation': 'bg-pink-100 text-pink-800',
      'Bug': 'bg-orange-100 text-orange-800',
    };
    
    return colorMap[label] || 'bg-neutral-100 text-neutral-800';
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => 
    (selectedPriority === 'all' || task.priority === selectedPriority) && 
    (selectedStatus === 'all' || task.status === selectedStatus) &&
    (selectedAssignee === 'all' || task.assignee.name === selectedAssignee)
  );

  // Table columns configuration
  const columns = [
    {
      key: 'title',
      header: 'Task',
      render: (value: string, item: any) => (
        <div>
          <div className="font-medium text-neutral-900">{value}</div>
          <p className="text-sm text-neutral-500 line-clamp-2">{item.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.labels.map((label: string, index: number) => (
              <span 
                key={index} 
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLabelColor(label)}`}
              >
                <Tag size={10} className="mr-1" />
                {label}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (value: any) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src={value.avatar}
              alt={value.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="ml-2 text-sm text-neutral-900">{value.name}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value: string) => (
        <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getPriorityBadgeColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'meta',
      header: '',
      render: (value: any, item: any) => (
        <div className="flex items-center justify-end space-x-4">
          {item.comments && (
            <div className="text-sm text-neutral-500 flex items-center">
              <MessageSquare size={14} className="mr-1" />
              {item.comments}
            </div>
          )}
          {item.attachments && (
            <div className="text-sm text-neutral-500 flex items-center">
              <Paperclip size={14} className="mr-1" />
              {item.attachments}
            </div>
          )}
          <div className="text-sm text-neutral-500 flex items-center">
            <Clock size={14} className="mr-1" />
            {format(new Date(item.dueDate), 'MMM dd')}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Team Tasks</h1>
          <p className="text-neutral-500">View and manage your team's tasks</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/tasks/create" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Create Task
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48">
          <label htmlFor="assigneeFilter" className="block text-sm font-medium text-neutral-700 mb-1">
            Assignee
          </label>
          <select
            id="assigneeFilter"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="form-input"
          >
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee === 'all' ? 'All Assignees' : assignee}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-48">
          <label htmlFor="priorityFilter" className="block text-sm font-medium text-neutral-700 mb-1">
            Priority
          </label>
          <select
            id="priorityFilter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="form-input"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-neutral-700 mb-1">
            Status
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-input"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      
      {/* Tasks Table */}
      <DataTable
        columns={columns}
        data={filteredTasks}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default TeamTasks;