import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, MoreHorizontal, Mail, Phone, Building2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { format } from 'date-fns';

// Mock client data
const clientsData = [
  {
    id: '1',
    companyName: 'Tech Solutions Inc.',
    industry: 'Technology',
    email: 'contact@techsolutions.com',
    phone: '+1 (555) 123-4567',
    status: 'hot',
    assignedTo: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    lastContact: '2023-10-15',
  },
  {
    id: '2',
    companyName: 'Healthcare Plus',
    industry: 'Healthcare',
    email: 'info@healthcareplus.com',
    phone: '+1 (555) 234-5678',
    status: 'warm',
    assignedTo: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    lastContact: '2023-10-14',
  },
  {
    id: '3',
    companyName: 'Global Finance Ltd',
    industry: 'Finance',
    email: 'contact@globalfinance.com',
    phone: '+1 (555) 345-6789',
    status: 'converted',
    assignedTo: {
      name: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    lastContact: '2023-10-13',
  },
  {
    id: '4',
    companyName: 'Retail Masters',
    industry: 'Retail',
    email: 'info@retailmasters.com',
    phone: '+1 (555) 456-7890',
    status: 'cold',
    assignedTo: {
      name: 'Emily Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    lastContact: '2023-10-12',
  },
  {
    id: '5',
    companyName: 'EduTech Systems',
    industry: 'Education',
    email: 'contact@edutechsys.com',
    phone: '+1 (555) 567-8901',
    status: 'warm',
    assignedTo: {
      name: 'David Lee',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    lastContact: '2023-10-11',
  },
];

const ClientList = () => {
  const [clients] = useState(clientsData);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  
  // Get unique industries for filter
  const industries = ['all', ...new Set(clients.map(client => client.industry))];
  
  // Get unique statuses for filter
  const statuses = ['all', 'cold', 'warm', 'hot', 'converted'];
  
  // Filter clients based on selected industry and status
  const filteredClients = clients.filter(client => 
    (selectedIndustry === 'all' || client.industry === selectedIndustry) && 
    (selectedStatus === 'all' || client.status === selectedStatus)
  );
  
  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cold':
        return 'bg-neutral-100 text-neutral-800';
      case 'warm':
        return 'bg-warning-100 text-warning-800';
      case 'hot':
        return 'bg-danger-100 text-danger-800';
      case 'converted':
        return 'bg-success-100 text-success-800';
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
      key: 'companyName',
      header: 'Company',
      render: (value: string, item: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-neutral-500" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{item.industry}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (value: any, item: any) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-neutral-600">
            <Mail size={14} className="mr-1" />
            {item.email}
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Phone size={14} className="mr-1" />
            {item.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      render: (value: any) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img src={value.avatar} alt={value.name} className="h-full w-full object-cover" />
          </div>
          <span className="ml-2 text-sm text-neutral-900">{value.name}</span>
        </div>
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
      key: 'lastContact',
      header: 'Last Contact',
      render: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value: any, item: any) => (
        <div className="flex items-center justify-end relative">
          <Link
            to={`/clients/${item.id}/edit`}
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
          <h1 className="text-2xl font-bold text-neutral-900">Clients</h1>
          <p className="text-neutral-500">Manage your client relationships</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/clients/add" className="btn-primary">
            <Plus size={18} className="mr-1" />
            Add Client
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48">
          <label htmlFor="industryFilter" className="block text-sm font-medium text-neutral-700 mb-1">
            Industry
          </label>
          <select
            id="industryFilter"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="form-input"
          >
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry === 'all' ? 'All Industries' : industry}
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
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Client Table */}
      <DataTable
        columns={columns}
        data={filteredClients}
        searchable={true}
        pagination={true}
      />
    </div>
  );
};

export default ClientList;