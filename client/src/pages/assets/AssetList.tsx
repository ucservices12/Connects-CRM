import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Download, Filter, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import DataTable from '../../components/common/DataTable';

// Mock assets data
const assetsData = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    serialNumber: 'MBP2023001',
    status: 'assigned',
    purchaseDate: '2023-01-15',
    warranty: '2024-01-15',
    assignedTo: {
      name: 'John Smith',
      department: 'IT',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: '2',
    name: 'Dell U2719D',
    type: 'Monitor',
    serialNumber: 'DELL2023001',
    status: 'available',
    purchaseDate: '2023-02-10',
    warranty: '2024-02-10',
    assignedTo: null,
  },
  {
    id: '3',
    name: 'iPhone 13',
    type: 'Mobile',
    serialNumber: 'IP2023001',
    status: 'maintenance',
    purchaseDate: '2023-03-01',
    warranty: '2024-03-01',
    assignedTo: null,
  },
  {
    id: '4',
    name: 'Logitech MX Master 3',
    type: 'Mouse',
    serialNumber: 'LG2023001',
    status: 'assigned',
    purchaseDate: '2023-04-15',
    warranty: '2024-04-15',
    assignedTo: {
      name: 'Sarah Johnson',
      department: 'Marketing',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  },
];

const AssetList = () => {
  const [assets] = useState(assetsData);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Get unique asset types for filter
  const assetTypes = ['all', ...new Set(assets.map(asset => asset.type))];
  
  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-success-100 text-success-800';
      case 'assigned':
        return 'bg-primary-100 text-primary-800';
      case 'maintenance':
        return 'bg-warning-100 text-warning-800';
      case 'retired':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Filter assets based on selected type and status
  const filteredAssets = assets.filter(asset => 
    (selectedType === 'all' || asset.type === selectedType) && 
    (selectedStatus === 'all' || asset.status === selectedStatus)
  );
  
  // Table columns configuration
  const columns = [
    {
      key: 'name',
      header: 'Asset',
      render: (value: string, item: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <Package className="h-6 w-6 text-neutral-500" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{item.type}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'serialNumber',
      header: 'Serial Number',
      render: (value: string) => (
        <div className="text-sm text-neutral-600">{value}</div>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (value: any) => (
        value ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <img src={value.avatar} alt={value.name} className="h-full w-full object-cover" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-neutral-900">{value.name}</div>
              <div className="text-sm text-neutral-500">{value.department}</div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-neutral-500">Not assigned</span>
        )
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
      key: 'dates',
      header: 'Dates',
      render: (value: any, item: any) => (
        <div>
          <div className="text-sm text-neutral-600">
            <Calendar size={14} className="inline mr-1" />
            Purchased: {format(new Date(item.purchaseDate), 'MMM dd, yyyy')}
          </div>
          <div className="text-sm text-neutral-500">
            <Calendar size={14} className="inline mr-1" />
            Warranty: {format(new Date(item.warranty), 'MMM dd, yyyy')}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, item: any) => (
        <div className="flex justify-end space-x-2">
          {item.status === 'available' ? (
            <Link
              to="/assets/assign"
              className="text-xs text-primary-700 bg-primary-100 hover:bg-primary-200 px-2 py-1 rounded"
            >
              Assign
            </Link>
          ) : item.status === 'assigned' ? (
            <button className="text-xs text-warning-700 bg-warning-100 hover:bg-warning-200 px-2 py-1 rounded">
              Return
            </button>
          ) : null}
          <button className="text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded">
            View History
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Asset Inventory</h1>
          <p className="text-neutral-500">Manage company assets and assignments</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link to="/assets/assign" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Assign Asset
          </Link>
          <button className="btn-outline">
            <Download size={18} className="mr-1" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48">
          <label htmlFor="typeFilter" className="block text-sm font-medium text-neutral-700 mb-1">
            Asset Type
          </label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-input"
          >
            {assetTypes.map((type) => (
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
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto md:ml-auto flex items-end">
          <button className="btn-outline w-full md:w-auto">
            <Filter size={18} className="mr-1" />
            More Filters
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Total Assets</div>
          <div className="text-2xl font-bold text-neutral-900 mt-1">48</div>
          <div className="text-xs text-neutral-500 mt-2">All company assets</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Assigned</div>
          <div className="text-2xl font-bold text-primary-600 mt-1">32</div>
          <div className="text-xs text-primary-500 mt-2">Currently in use</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Available</div>
          <div className="text-2xl font-bold text-success-600 mt-1">12</div>
          <div className="text-xs text-success-500 mt-2">Ready to assign</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="text-sm text-neutral-500">Maintenance</div>
          <div className="text-2xl font-bold text-warning-600 mt-1">4</div>
          <div className="text-xs text-warning-500 mt-2">Under repair</div>
        </div>
      </div>
      
      {/* Assets Table */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default AssetList;