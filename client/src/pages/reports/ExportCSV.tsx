import { useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';

const ExportCSV = () => {
  const [selectedReport, setSelectedReport] = useState('employees');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const reports = [
    {
      id: 'employees',
      name: 'Employee Report',
      description: 'Export complete employee data including personal details, department, and role',
      fields: ['Name', 'Email', 'Department', 'Position', 'Joining Date', 'Status']
    },
    {
      id: 'attendance',
      name: 'Attendance Report',
      description: 'Export attendance records including check-in/out times and leave data',
      fields: ['Employee', 'Date', 'Check In', 'Check Out', 'Status', 'Total Hours']
    },
    {
      id: 'tasks',
      name: 'Task Report',
      description: 'Export task completion data and project progress metrics',
      fields: ['Task', 'Assignee', 'Status', 'Priority', 'Due Date', 'Completion Date']
    },
    {
      id: 'payroll',
      name: 'Payroll Report',
      description: 'Export salary and compensation data for all employees',
      fields: ['Employee', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Payment Date']
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, this would trigger the actual export
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Export Reports</h1>
        <p className="text-neutral-500">Generate and download reports in various formats</p>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {reports.map(report => (
          <div
            key={report.id}
            className={`p-6 rounded-lg border cursor-pointer transition-colors ${
              selectedReport === report.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={selectedReport === report.id}
                onChange={() => setSelectedReport(report.id)}
                className="mt-1 h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
              />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-neutral-900">{report.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{report.description}</p>
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-neutral-700 mb-1">Included Fields:</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.fields.map((field, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Export Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="form-input pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="form-input pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Export Format</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('csv')}
                  className={`p-3 text-center rounded-lg border ${
                    selectedFormat === 'csv'
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('excel')}
                  className={`p-3 text-center rounded-lg border ${
                    selectedFormat === 'excel'
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  Excel
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-3 text-center rounded-lg border ${
                    selectedFormat === 'pdf'
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Additional Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-600">Include header row</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-600">Export all pages</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-600">Compress file</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-primary"
        >
          {isExporting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </span>
          ) : (
            <>
              <Download size={18} className="mr-1" />
              Export Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportCSV;