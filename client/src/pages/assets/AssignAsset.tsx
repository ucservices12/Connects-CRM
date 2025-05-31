import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Calendar, Tag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data
const assets = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    serialNumber: 'MBP2023001',
    status: 'available',
    purchaseDate: '2023-01-15',
    warranty: '2024-01-15',
  },
  {
    id: '2',
    name: 'Dell U2719D',
    type: 'Monitor',
    serialNumber: 'DELL2023001',
    status: 'available',
    purchaseDate: '2023-02-10',
    warranty: '2024-02-10',
  },
  {
    id: '3',
    name: 'iPhone 13',
    type: 'Mobile',
    serialNumber: 'IP2023001',
    status: 'available',
    purchaseDate: '2023-03-01',
    warranty: '2024-03-01',
  },
];

const employees = [
  {
    id: '1',
    name: 'John Smith',
    department: 'IT',
    position: 'Software Developer',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    department: 'Marketing',
    position: 'Marketing Manager',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Michael Brown',
    department: 'Finance',
    position: 'Financial Analyst',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const AssignAsset = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [notes, setNotes] = useState('');

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter assets based on search
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(assetSearchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset || !selectedEmployee) {
      toast.error('Please select both an asset and an employee');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Asset assigned successfully');
      navigate('/assets/list');
    } catch (error) {
      toast.error('Failed to assign asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Assign Asset</h1>
        <p className="text-neutral-500">Assign company assets to employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Select Asset</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search assets..."
              value={assetSearchQuery}
              onChange={(e) => setAssetSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>

          {/* Asset List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAsset === asset.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedAsset(asset.id)}
              >
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-neutral-500" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-neutral-900">{asset.name}</h3>
                      <span className="inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 bg-success-100 text-success-800">
                        Available
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500">{asset.type}</p>
                    <p className="text-xs text-neutral-500 mt-1">SN: {asset.serialNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Select Employee</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          </div>

          {/* Employee List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedEmployee === employee.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                }`}
                onClick={() => setSelectedEmployee(employee.id)}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-neutral-900">{employee.name}</h3>
                    <p className="text-sm text-neutral-500">{employee.position}</p>
                    <p className="text-xs text-neutral-500">{employee.department}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Assignment Details</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label htmlFor="assignmentDate" className="form-label">
                  Assignment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="assignmentDate"
                    value={assignmentDate}
                    onChange={(e) => setAssignmentDate(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="returnDate" className="form-label">
                  Expected Return Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="returnDate"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="form-input pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>
            </div>

            <div className="form-group mb-6">
              <label htmlFor="notes" className="form-label">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
                rows={3}
                placeholder="Add any additional notes or comments..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => navigate('/assets/list')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !selectedAsset || !selectedEmployee}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Assigning Asset...
                  </span>
                ) : (
                  'Assign Asset'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignAsset;