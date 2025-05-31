import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MoreHorizontal, FileText, Mail } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

// Mock employee data
const employeesData = [
  { id: '1', name: 'John Smith', email: 'john.smith@example.com', position: 'Software Developer', department: 'IT', joiningDate: '2023-01-15', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', position: 'Marketing Specialist', department: 'Marketing', joiningDate: '2023-02-10', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', position: 'Financial Analyst', department: 'Finance', joiningDate: '2023-03-05', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Emily Wilson', email: 'emily.wilson@example.com', position: 'UI/UX Designer', department: 'IT', joiningDate: '2023-04-20', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'David Lee', email: 'david.lee@example.com', position: 'HR Manager', department: 'HR', joiningDate: '2023-05-12', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Jessica Parker', email: 'jessica.parker@example.com', position: 'Sales Representative', department: 'Sales', joiningDate: '2023-06-18', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: '7', name: 'Robert Garcia', email: 'robert.garcia@example.com', position: 'Product Manager', department: 'Product', joiningDate: '2023-07-02', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Lisa Chen', email: 'lisa.chen@example.com', position: 'Customer Support', department: 'Support', joiningDate: '2023-08-14', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '9', name: 'James Wilson', email: 'james.wilson@example.com', position: 'Full Stack Developer', department: 'IT', joiningDate: '2023-09-09', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '10', name: 'Patricia Moore', email: 'patricia.moore@example.com', position: 'Content Writer', department: 'Marketing', joiningDate: '2023-09-25', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: '11', name: 'Christopher Taylor', email: 'christopher.taylor@example.com', position: 'Systems Administrator', department: 'IT', joiningDate: '2023-10-01', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '12', name: 'Amanda White', email: 'amanda.white@example.com', position: 'Project Manager', department: 'Operations', joiningDate: '2023-10-05', status: 'Active', avatar: 'https://i.pravatar.cc/150?img=12' },
];

const EmployeeList = () => {
  const [employees] = useState(employeesData);
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  // Get unique departments for filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];
  
  // Get unique statuses for filter
  const statuses = ['all', ...new Set(employees.map(emp => emp.status))];
  
  // Filter employees based on selected department and status
  const filteredEmployees = employees.filter(employee => 
    (selectedDept === 'all' || employee.department === selectedDept) && 
    (selectedStatus === 'all' || employee.status === selectedStatus)
  );
  
  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
        return 'bg-danger-100 text-danger-800';
      case 'on leave':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Handle dropdown toggle
  const toggleDropdown = (id: string) => {
    if (showDropdown === id) {
      setShowDropdown(null);
    } else {
      setShowDropdown(id);
    }
  };
  
  // Close dropdown when clicking outside
  window.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.dropdown-trigger')) {
      setShowDropdown(null);
    }
  });
  
  // Table columns configuration
  const columns = [
    {
      key: 'name',
      header: 'Employee',
      render: (value: string, item: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img src={item.avatar} alt={value} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position',
    },
    {
      key: 'department',
      header: 'Department',
      render: (value: string) => (
        <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 px-2 py-1">
          {value}
        </span>
      ),
    },
    {
      key: 'joiningDate',
      header: 'Joining Date',
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, item: any) => (
        <div className="flex items-center justify-end relative">
          <Link
            to={`/employees/${item.id}`}
            className="text-primary-600 hover:text-primary-900 mr-2"
            title="View"
          >
            <FileText size={18} />
          </Link>
          <Link
            to={`/employees/${item.id}/edit`}
            className="text-primary-600 hover:text-primary-900 mr-2"
            title="Edit"
          >
            <Edit2 size={18} />
          </Link>
          <button
            className="dropdown-trigger text-neutral-600 hover:text-neutral-900"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(item.id);
            }}
            title="More"
          >
            <MoreHorizontal size={18} />
          </button>
          
          {/* Dropdown menu */}
          {showDropdown === item.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-neutral-200">
              <button
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
              >
                <Mail size={16} className="mr-2" />
                Send Email
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-neutral-100 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Employees</h1>
          <p className="text-neutral-500">Manage your organization's employees</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/employees/add" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Add Employee
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48">
          <label htmlFor="departmentFilter" className="block text-sm font-medium text-neutral-700 mb-1">
            Department
          </label>
          <select
            id="departmentFilter"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="form-input"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
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
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Employee Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default EmployeeList;