import { useState } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';

// Mock leave history data
const leaveHistoryData = [
  {
    id: '1',
    leaveType: 'Annual Leave',
    startDate: '2023-10-01',
    endDate: '2023-10-05',
    days: 5,
    reason: 'Family vacation',
    status: 'Approved',
    approvedBy: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    approvedAt: '2023-09-25T10:30:00',
  },
  {
    id: '2',
    leaveType: 'Sick Leave',
    startDate: '2023-09-15',
    endDate: '2023-09-16',
    days: 2,
    reason: 'Not feeling well',
    status: 'Approved',
    approvedBy: {
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    approvedAt: '2023-09-14T14:20:00',
  },
  {
    id: '3',
    leaveType: 'Emergency Leave',
    startDate: '2023-09-10',
    endDate: '2023-09-10',
    days: 1,
    reason: 'Family emergency',
    status: 'Approved',
    approvedBy: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    approvedAt: '2023-09-10T08:15:00',
  },
  {
    id: '4',
    leaveType: 'Annual Leave',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
    days: 3,
    reason: 'Personal matters',
    status: 'Rejected',
    approvedBy: {
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    approvedAt: '2023-08-18T16:45:00',
  },
];

const LeaveHistory = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  
  // Get unique leave types for filter
  const leaveTypes = ['all', ...new Set(leaveHistoryData.map(leave => leave.leaveType))];
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-danger-100 text-danger-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'cancelled':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Filter leave history
  const filteredHistory = leaveHistoryData.filter(leave => 
    (selectedType === 'all' || leave.leaveType === selectedType) && 
    (selectedStatus === 'all' || leave.status.toLowerCase() === selectedStatus)
  );
  
  // Table columns configuration
  const columns = [
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: (value: string) => (
        <div className="text-sm font-medium text-neutral-900">{value}</div>
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
      key: 'approvedBy',
      header: 'Approved By',
      render: (value: any) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img src={value.avatar} alt={value.name} className="h-full w-full object-cover" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-neutral-900">{value.name}</div>
            <div className="text-xs text-neutral-500">
              {format(new Date(value.approvedAt), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Leave History</h1>
          <p className="text-neutral-500">View your leave history and status</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn-outline">
            <Download size={18} className="mr-1" />
            Export History
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <label htmlFor="monthFilter" className="block text-sm font-medium text-neutral-700 mb-1">
              Month
            </label>
            <div className="relative">
              <input
                type="month"
                id="monthFilter"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-input pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
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
          <div className="text-sm text-neutral-500">Total Leaves</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">18</div>
          <div className="text-xs text-neutral-500 mt-2">This year</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Annual Leave</div>
          <div className="text-2xl font-bold text-primary-600 mt-1">12</div>
          <div className="text-xs text-primary-500 mt-2">9 days remaining</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Sick Leave</div>
          <div className="text-2xl font-bold text-accent-600 mt-1">4</div>
          <div className="text-xs text-accent-500 mt-2">10 days remaining</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Emergency Leave</div>
          <div className="text-2xl font-bold text-warning-600 mt-1">2</div>
          <div className="text-xs text-warning-500 mt-2">5 days remaining</div>
        </div>
      </div>
      
      {/* Leave History Table */}
      <DataTable
        columns={columns}
        data={filteredHistory}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default LeaveHistory;