import { useState } from 'react';
import { Package, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Mock employee assets data
const employeeData = {
  id: '1',
  name: 'John Smith',
  department: 'IT',
  position: 'Senior Software Developer',
  avatar: 'https://i.pravatar.cc/150?img=1',
  assets: [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      type: 'Laptop',
      serialNumber: 'MBP2023001',
      assignedDate: '2023-01-15',
      returnDate: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Dell U2719D',
      type: 'Monitor',
      serialNumber: 'DELL2023001',
      assignedDate: '2023-01-15',
      returnDate: '2024-01-15',
      status: 'active',
    },
    {
      id: '3',
      name: 'iPhone 13',
      type: 'Mobile',
      serialNumber: 'IP2023001',
      assignedDate: '2023-03-01',
      returnDate: '2024-03-01',
      status: 'active',
    },
    {
      id: '4',
      name: 'Logitech MX Master 3',
      type: 'Mouse',
      serialNumber: 'LG2023001',
      assignedDate: '2023-01-15',
      returnDate: null,
      status: 'active',
    },
  ],
  history: [
    {
      id: '1',
      asset: 'HP EliteBook',
      type: 'Laptop',
      serialNumber: 'HP2022001',
      assignedDate: '2022-01-15',
      returnDate: '2023-01-15',
      status: 'returned',
    },
    {
      id: '2',
      asset: 'iPad Pro',
      type: 'Tablet',
      serialNumber: 'IP2022001',
      assignedDate: '2022-06-01',
      returnDate: '2022-12-31',
      status: 'returned',
    },
  ],
};

const EmployeeAssets = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'returned':
        return 'bg-neutral-100 text-neutral-800';
      case 'overdue':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/employees" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Employees
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img
                src={employeeData.avatar}
                alt={employeeData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-neutral-900">{employeeData.name}</h1>
              <p className="text-neutral-500">{employeeData.position} • {employeeData.department}</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/assets/assign" className="btn-primary">
              Assign New Asset
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Total Assets</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">
            {employeeData.assets.length}
          </div>
          <div className="text-xs text-neutral-500 mt-2">Currently assigned</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Asset Value</div>
          <div className="text-2xl font-bold text-primary-600 mt-1">$4,500</div>
          <div className="text-xs text-primary-500 mt-2">Total value of assets</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Due for Return</div>
          <div className="text-2xl font-bold text-warning-600 mt-1">1</div>
          <div className="text-xs text-warning-500 mt-2">Within next 30 days</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Returned</div>
          <div className="text-2xl font-bold text-success-600 mt-1">
            {employeeData.history.length}
          </div>
          <div className="text-xs text-success-500 mt-2">All time</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'current'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Current Assets
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  :   'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Asset History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'current' ? (
            <div className="space-y-4">
              {employeeData.assets.map(asset => (
                <div
                  key={asset.id}
                  className="flex items-start p-4 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-neutral-50"
                >
                  <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-neutral-500" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">{asset.name}</h3>
                        <p className="text-sm text-neutral-500">{asset.type}</p>
                      </div>
                      <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(asset.status)}`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="text-neutral-600">
                        <span className="text-neutral-500">Serial Number:</span> {asset.serialNumber}
                      </div>
                      <div className="text-neutral-600">
                        <span className="text-neutral-500">Assigned:</span> {format(new Date(asset.assignedDate), 'MMM dd, yyyy')}
                      </div>
                      {asset.returnDate && (
                        <div className="text-neutral-600">
                          <span className="text-neutral-500">Return Date:</span> {format(new Date(asset.returnDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-xs text-warning-700 bg-warning-100 hover:bg-warning-200 px-2 py-1 rounded">
                        Return Asset
                      </button>
                      <button className="text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {employeeData.history.map(asset => (
                <div
                  key={asset.id}
                  className="flex items-start p-4 rounded-lg border border-neutral-200 bg-neutral-50"
                >
                  <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-neutral-500" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900">{asset.asset}</h3>
                        <p className="text-sm text-neutral-500">{asset.type}</p>
                      </div>
                      <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(asset.status)}`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="text-neutral-600">
                        <span className="text-neutral-500">Serial Number:</span> {asset.serialNumber}
                      </div>
                      <div className="text-neutral-600">
                        <span className="text-neutral-500">Assigned:</span> {format(new Date(asset.assignedDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-neutral-600">
                        <span className="text-neutral-500">Returned:</span> {format(new Date(asset.returnDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAssets;