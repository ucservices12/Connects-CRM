import { useState } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';

// Mock attendance data
const attendanceData = [
  {
    id: '1',
    employeeName: 'John Smith',
    department: 'IT',
    date: '2023-10-16',
    clockIn: '09:00:00',
    clockOut: '18:00:00',
    totalHours: '9:00',
    status: 'Present',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    date: '2023-10-16',
    clockIn: '09:15:00',
    clockOut: '18:30:00',
    totalHours: '9:15',
    status: 'Present',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    employeeName: 'Michael Brown',
    department: 'Finance',
    date: '2023-10-16',
    clockIn: '10:00:00',
    clockOut: '18:45:00',
    totalHours: '8:45',
    status: 'Late',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    employeeName: 'Emily Wilson',
    department: 'HR',
    date: '2023-10-16',
    clockIn: '-',
    clockOut: '-',
    totalHours: '0:00',
    status: 'Absent',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

const AttendanceTable = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Get unique departments for filter
  const departments = ['all', ...new Set(attendanceData.map(record => record.department))];
  
  // Get unique statuses for filter
  const statuses = ['all', 'Present', 'Late', 'Absent'];
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-success-100 text-success-800';
      case 'late':
        return 'bg-warning-100 text-warning-800';
      case 'absent':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Filter attendance records
  const filteredRecords = attendanceData.filter(record => 
    (selectedDepartment === 'all' || record.department === selectedDepartment) && 
    (selectedStatus === 'all' || record.status === selectedStatus)
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
      key: 'clockIn',
      header: 'Clock In',
      render: (value: string) => (
        <div className="text-sm text-neutral-600">{value}</div>
      ),
    },
    {
      key: 'clockOut',
      header: 'Clock Out',
      render: (value: string) => (
        <div className="text-sm text-neutral-600">{value}</div>
      ),
    },
    {
      key: 'totalHours',
      header: 'Total Hours',
      render: (value: string) => (
        <div className="text-sm text-neutral-600">{value}</div>
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
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Attendance Records</h1>
          <p className="text-neutral-500">View and manage employee attendance</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn-outline">
            <Download size={18} className="mr-1" />
            Export Records
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <label htmlFor="dateFilter" className="block text-sm font-medium text-neutral-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="dateFilter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
          </div>
          
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
          <div className="text-sm text-neutral-500">Total Employees</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">125</div>
          <div className="text-xs text-neutral-500 mt-2">For selected date</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Present</div>
          <div className="text-2xl font-bold text-success-600 mt-1">118</div>
          <div className="text-xs text-success-500 mt-2">94.4% attendance rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Late</div>
          <div className="text-2xl font-bold text-warning-600 mt-1">5</div>
          <div className="text-xs text-warning-500 mt-2">4% late rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Absent</div>
          <div className="text-2xl font-bold text-danger-600 mt-1">2</div>
          <div className="text-xs text-danger-500 mt-2">1.6% absence rate</div>
        </div>
      </div>
      
      {/* Attendance Table */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default AttendanceTable;