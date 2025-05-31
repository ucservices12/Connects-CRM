import { useState } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';
import toast from 'react-hot-toast';

// Mock leave requests data
const leaveRequestsData = [
  {
    id: '1',
    employeeName: 'John Smith',
    department: 'IT',
    leaveType: 'Annual Leave',
    startDate: '2023-10-20',
    endDate: '2023-10-25',
    days: 6,
    reason: 'Family vacation',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2023-10-18',
    endDate: '2023-10-19',
    days: 2,
    reason: 'Not feeling well',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    employeeName: 'Michael Brown',
    department: 'Finance',
    leaveType: 'Emergency Leave',
    startDate: '2023-10-17',
    endDate: '2023-10-17',
    days: 1,
    reason: 'Family emergency',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const LeaveRequests = () => {
  const [requests, setRequests] = useState(leaveRequestsData);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedType, setSelectedType] = useState('all');
  
  // Get unique departments for filter
  const departments = ['all', ...new Set(requests.map(request => request.department))];
  
  // Get unique leave types for filter
  const leaveTypes = ['all', ...new Set(requests.map(request => request.leaveType))];
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-danger-100 text-danger-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Handle approve/reject
  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.map(request => 
        request.id === id
          ? { ...request, status: action === 'approve' ? 'Approved' : 'Rejected' }
          : request
      ));
      
      toast.success(`Leave request ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} leave request`);
    }
  };
  
  // Filter requests
  const filteredRequests = requests.filter(request => 
    (selectedDepartment === 'all' || request.department === selectedDepartment) && 
    (selectedStatus === 'all' || request.status.toLowerCase() === selectedStatus) &&
    (selectedType === 'all' || request.leaveType === selectedType)
  );
  
  // Table columns configuration
  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (value: string, item: any) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img src={item.avatar} alt={value} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{item.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: (value: string) => (
        <div className="text-sm text-neutral-900">{value}</div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (value: any, item: any) => (
        <div>
          <div className="text-sm text-neutral-900">
            {format(new Date(item.startDate), 'MMM dd')} - {format(new Date(item.endDate), 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-neutral-500">{item.days} days</div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (value: string) => (
        <div className="text-sm text-neutral-600 max-w-xs truncate">{value}</div>
      ),
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
        <div className="flex justify-end space-x-2">
          {item.status === 'Pending' && (
            <>
              <button
                onClick={() => handleAction(item.id, 'approve')}
                className="text-xs text-success-700 bg-success-100 hover:bg-success-200 px-2 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(item.id, 'reject')}
                className="text-xs text-danger-700 bg-danger-100 hover:bg-danger-200 px-2 py-1 rounded"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Leave Requests</h1>
          <p className="text-neutral-500">Review and manage employee leave requests</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn-outline">
            <Download size={18} className="mr-1" />
            Export Requests
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <label htmlFor="departmentFilter" className="block text-sm font-medium text-neutral-700 mb-1">
              Department
            </label>
            <select
              id="departmentFilter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
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
            <label htmlFor="typeFilter" className="block text-sm font-medium text-neutral-700 mb-1">
              Leave Type
            </label>
            <select
              id="typeFilter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-input"
            >
              {leaveTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
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
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto md:ml-auto flex items-end">
            <button className="btn-outline w-full md:w-auto">
              <Filter size={18} className="mr-1" />
              More Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Total Requests</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">24</div>
          <div className="text-xs text-neutral-500 mt-2">This month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Pending</div>
          <div className="text-2xl font-bold text-warning-600 mt-1">8</div>
          <div className="text-xs text-warning-500 mt-2">Requires action</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Approved</div>
          <div className="text-2xl font-bold text-success-600 mt-1">12</div>
          <div className="text-xs text-success-500 mt-2">This month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Rejected</div>
          <div className="text-2xl font-bold text-danger-600 mt-1">4</div>
          <div className="text-xs text-danger-500 mt-2">This month</div>
        </div>
      </div>
      
      {/* Leave Requests Table */}
      <DataTable
        columns={columns}
        data={filteredRequests}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default LeaveRequests;