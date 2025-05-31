import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2, Calendar, Clock, FileText, Package, Edit2, Download } from 'lucide-react';
import { format } from 'date-fns';

// Mock employee data
const employeeData = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Suite 100, San Francisco, CA 94105',
  department: 'IT',
  position: 'Senior Software Developer',
  role: 'employee',
  joiningDate: '2023-01-15',
  salary: 85000,
  status: 'Active',
  avatar: 'https://i.pravatar.cc/300?img=1',
  manager: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://i.pravatar.cc/300?img=2',
  },
  attendance: {
    present: 95,
    absent: 3,
    late: 2,
  },
  leaves: {
    total: 21,
    taken: 12,
    remaining: 9,
  },
  assets: [
    { id: 1, name: 'MacBook Pro 16"', type: 'Laptop', assignedDate: '2023-01-15' },
    { id: 2, name: 'Dell U2719D', type: 'Monitor', assignedDate: '2023-01-15' },
    { id: 3, name: 'iPhone 13', type: 'Mobile', assignedDate: '2023-03-01' },
  ],
  documents: [
    { id: 1, name: 'Employment Contract', type: 'PDF', uploadedDate: '2023-01-15' },
    { id: 2, name: 'NDA Agreement', type: 'PDF', uploadedDate: '2023-01-15' },
    { id: 3, name: 'Performance Review Q1', type: 'PDF', uploadedDate: '2023-04-01' },
  ],
};

const EmployeeProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, fetch employee data based on id
  const employee = employeeData;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leaves', label: 'Leaves' },
    { id: 'assets', label: 'Assets' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img
                src={employee.avatar}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:ml-6 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-neutral-500">{employee.position}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-2">
                <Link to={`/employees/${id}/edit`} className="btn-primary">
                  <Edit2 size={18} className="mr-1" />
                  Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-neutral-600">
                <Mail size={18} className="mr-2" />
                <span>{employee.email}</span>
              </div>
              
              <div className="flex items-center text-neutral-600">
                <Phone size={18} className="mr-2" />
                <span>{employee.phone}</span>
              </div>
              
              <div className="flex items-center text-neutral-600">
                <MapPin size={18} className="mr-2" />
                <span className="truncate">{employee.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Employment Details */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <Building2 size={20} className="mr-2 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Department</p>
                      <p className="text-sm text-neutral-500">{employee.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar size={20} className="mr-2 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Joining Date</p>
                      <p className="text-sm text-neutral-500">
                        {format(new Date(employee.joiningDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="mr-2 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Status</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-800">
                        {employee.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manager */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Reporting Manager</h3>
                <div className="flex items-center p-4 rounded-lg border border-neutral-200">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={employee.manager.avatar}
                      alt={employee.manager.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-neutral-900">{employee.manager.name}</p>
                    <p className="text-sm text-neutral-500">{employee.manager.email}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Attendance */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Attendance Rate</h4>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-neutral-900">{employee.attendance.present}%</p>
                        <p className="text-xs text-neutral-500">Last 30 days</p>
                      </div>
                      <div className="text-right text-xs text-neutral-500">
                        <p>{employee.attendance.absent} Absent</p>
                        <p>{employee.attendance.late} Late</p>
                      </div>
                    </div>
                  </div>

                  {/* Leaves */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Leave Balance</h4>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-neutral-900">{employee.leaves.remaining}</p>
                        <p className="text-xs text-neutral-500">Days Remaining</p>
                      </div>
                      <div className="text-right text-xs text-neutral-500">
                        <p>{employee.leaves.total} Total</p>
                        <p>{employee.leaves.taken} Taken</p>
                      </div>
                    </div>
                  </div>

                  {/* Assets */}
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Assigned Assets</h4>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-neutral-900">{employee.assets.length}</p>
                        <p className="text-xs text-neutral-500">Total Assets</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Attendance History</h3>
              {/* Add attendance history table or calendar view here */}
            </div>
          )}

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Leave History</h3>
              {/* Add leave history table here */}
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Assigned Assets</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Asset Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Assigned Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {employee.assets.map(asset => (
                      <tr key={asset.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          <div className="flex items-center">
                            <Package size={16} className="mr-2 text-neutral-400" />
                            {asset.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {asset.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {format(new Date(asset.assignedDate), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Employee Documents</h3>
              <div className="space-y-2">
                {employee.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50"
                  >
                    <div className="flex items-center">
                      <FileText size={20} className="text-neutral-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                        <p className="text-xs text-neutral-500">
                          Uploaded on {format(new Date(doc.uploadedDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <button className="btn-outline text-sm py-1">
                      <Download size={16} className="mr-1" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;