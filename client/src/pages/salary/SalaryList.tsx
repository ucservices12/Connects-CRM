import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DataTable from '../../components/common/DataTable';

// Mock salary data
const salaryData = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    department: 'IT',
    position: 'Senior Software Developer',
    month: '2025-06-01',
    baseSalary: 85000,
    allowances: 5000,
    deductions: 2500,
    netSalary: 87500,
    status: 'Paid',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    department: 'Marketing',
    position: 'Marketing Manager',
    month: '2025-07-15',
    baseSalary: 75000,
    allowances: 4000,
    deductions: 2000,
    netSalary: 77000,
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Michael Brown',
    department: 'Finance',
    position: 'Financial Analyst',
    month: '2025-08-10',
    baseSalary: 70000,
    allowances: 3500,
    deductions: 1800,
    netSalary: 71700,
    status: 'Paid',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const SalaryList = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const departments = ['all', ...new Set(salaryData.map(s => s.department))];

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-success-100 text-success-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'failed': return 'bg-danger-100 text-danger-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  // Filter salary records by department, status, and month+year only
  const filteredRecords = salaryData.filter(s =>
    (selectedDepartment === 'all' || s.department === selectedDepartment) &&
    (selectedStatus === 'all' || s.status.toLowerCase() === selectedStatus) &&
    (selectedDate === '' || s.month.slice(0, 7) === selectedDate)
  );

  // Export all filtered data to PDF (A4 landscape, no overlap)
  const handleExportAll = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    autoTable(doc, {
      head: [[
        'Employee ID', 'Employee', 'Department', 'Position', 'Date', 'Base Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status'
      ]],
      body: filteredRecords.map(item => [
        item.employeeId,
        item.employeeName,
        item.department,
        item.position,
        format(new Date(item.month), 'dd MMMM yyyy'),
        item.baseSalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        item.allowances.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        item.deductions.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        item.netSalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
        item.status,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 20,
        fontStyle: 'bold',
      },
      theme: 'grid',
      margin: { top: 50, left: 20, right: 20 },
      tableWidth: 'auto',
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text('Salary List', data.settings.margin.left, 30);
      },
    });

    doc.save('salary-list.pdf');
  };

  // Table columns configuration
  const columns = [
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (value: string) => (
        <span className="text-sm font-medium text-neutral-900">{value}</span>
      ),
    },
    {
      key: 'employeeName',
      header: 'Employee',
      render: (value: string, item: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden">
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
      key: 'position',
      header: 'Position',
      render: (value: string) => (
        <div className="text-sm text-neutral-600">{value}</div>
      ),
    },
    {
      key: 'salary',
      header: 'Salary Details',
      render: (_: any, item: any) => (
        <div>
          <div className="text-sm font-medium text-neutral-900">
            {item.netSalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </div>
          <div className="text-xs text-neutral-500">
            Base: {item.baseSalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-success-600">
              +{item.allowances.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </span>
            <span className="text-danger-600">
              -{item.deductions.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'month',
      header: 'Date',
      render: (value: string) => (
        <div className="text-sm text-neutral-600">
          {format(new Date(value), 'dd MMMM yyyy')}
        </div>
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
      render: (_: any, item: any) => (
        <div className="flex justify-end space-x-2">
          <Link
            to={`/salary/payslip/${item.id}`}
            className="text-xs text-primary-700 bg-primary-100 hover:bg-primary-200 px-2 py-1 rounded"
          >
            View Payslip
          </Link>
          <button className="text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded">
            Download
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Salary List</h1>
          <p className="text-neutral-500">View and manage employee salaries</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link to="/salary/generate" className="btn-primary">
            Generate Salary
          </Link>
          <button className="btn-outline" onClick={handleExportAll}>
            <Download size={18} className="mr-1" />
            Export All
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
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
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

      {/* Salary Table */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default SalaryList;