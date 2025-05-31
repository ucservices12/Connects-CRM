import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data
const clients = [
  {
    id: '1',
    companyName: 'Tech Solutions Inc.',
    industry: 'Technology',
    status: 'warm',
    currentAssignee: null,
  },
  {
    id: '2',
    companyName: 'Healthcare Plus',
    industry: 'Healthcare',
    status: 'hot',
    currentAssignee: {
      id: '1',
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: '3',
    companyName: 'Global Finance Ltd',
    industry: 'Finance',
    status: 'cold',
    currentAssignee: null,
  },
];

const teamMembers = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Sales Representative',
    avatar: 'https://i.pravatar.cc/150?img=1',
    activeClients: 5,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Account Manager',
    avatar: 'https://i.pravatar.cc/150?img=2',
    activeClients: 3,
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Sales Manager',
    avatar: 'https://i.pravatar.cc/150?img=3',
    activeClients: 4,
  },
];

const AssignClient = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter clients based on search query
  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cold':
        return 'bg-neutral-100 text-neutral-800';
      case 'warm':
        return 'bg-warning-100 text-warning-800';
      case 'hot':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !selectedTeamMember) {
      toast.error('Please select both a client and team member');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Client assigned successfully');
      navigate('/clients');
    } catch (error) {
      toast.error('Failed to assign client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Assign Client</h1>
        <p className="text-neutral-500">Assign clients to team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Select Client</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>

          {/* Client List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedClient === client.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedClient(client.id)}
              >
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-neutral-500" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-neutral-900">{client.companyName}</h3>
                      <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(client.status)}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">{client.industry}</p>
                    
                    {client.currentAssignee && (
                      <div className="mt-2 flex items-center">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                          <img
                            src={client.currentAssignee.avatar}
                            alt={client.currentAssignee.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="ml-2 text-xs text-neutral-500">
                          Currently assigned to {client.currentAssignee.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Member Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Select Team Member</h2>
          
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div
                key={member.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTeamMember === member.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedTeamMember(member.id)}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-neutral-900">{member.name}</h3>
                    <p className="text-sm text-neutral-500">{member.role}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-sm font-medium text-neutral-900">{member.activeClients}</span>
                    <p className="text-xs text-neutral-500">Active Clients</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="btn-outline"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary"
          disabled={!selectedClient || !selectedTeamMember || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Assigning...
            </span>
          ) : (
            'Assign Client'
          )}
        </button>
      </div>
    </div>
  );
};

export default AssignClient;