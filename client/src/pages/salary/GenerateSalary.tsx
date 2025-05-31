import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Mock employee data
const employeesData = [
  {
    id: '1',
    name: 'John Smith',
    department: 'IT',
    position: 'Senior Software Developer',
    baseSalary: 85000,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    department: 'Marketing',
    position: 'Marketing Manager',
    baseSalary: 75000,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Michael Brown',
    department: 'Finance',
    position: 'Financial Analyst',
    baseSalary: 70000,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const GenerateSalary = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedEmployees.length === employeesData.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employeesData.map(emp => emp.id));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Salary generated successfully');
      navigate('/salary/list');
    } catch (error) {
      toast.error('Failed to generate salary');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Generate Salary</h1>
        <p className="text-neutral-500">Process monthly salary for employees</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Salary Generation Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="form-group">
                  <label htmlFor="month" className="form-label">
                    Salary Month
                  </label>
                  <div className="relative">
                    <input
                      type="month"
                      id="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="form-input pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-neutral-900">Select Employees</h2>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      {selectedEmployees.length === employeesData.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {employeesData.map(employee => (
                      <div
                        key={employee.id}
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          selectedEmployees.includes(employee.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-primary-200 hover:bg-neutral-50'
                        }`}
                        onClick={() => handleEmployeeToggle(employee.id)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleEmployeeToggle(employee.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img
                                  src={employee.avatar}
                                  alt={employee.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-neutral-900">{employee.name}</div>
                                <div className="text-sm text-neutral-500">{employee.position}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-neutral-900">
                              ${employee.baseSalary.toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-500">Base Salary</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => navigate('/salary/list')}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting || selectedEmployees.length === 0}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Salary'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Summary</h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary-50 border border-primary-100">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary-600" />
                  <div className="ml-3">
                    <div className="text-sm text-primary-600">Selected Employees</div>
                    <div className="text-2xl font-bold text-primary-900">
                      {selectedEmployees.length}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-accent-50 border border-accent-100">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-accent-600" />
                  <div className="ml-3">
                    <div className="text-sm text-accent-600">Total Base Salary</div>
                    <div className="text-2xl font-bold text-accent-900">
                      ${employeesData
                        .filter(emp => selectedEmployees.includes(emp.id))
                        .reduce((sum, emp) => sum + emp.baseSalary, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-success-50 border border-success-100">
                <div className="flex items-center">
                  <Calculator className="h-8 w-8 text-success-600" />
                  <div className="ml-3">
                    <div className="text-sm text-success-600">Processing Month</div>
                    <div className="text-2xl font-bold text-success-900">
                      {format(new Date(selectedMonth), 'MMMM yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Notes</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-start">
                  <Calendar className="h-4 w-4 mt-0.5 mr-2 text-neutral-400" />
                  Salary will be processed for the selected month
                </li>
                <li className="flex items-start">
                  <DollarSign className="h-4 w-4 mt-0.5 mr-2 text-neutral-400" />
                  Includes base salary and allowances
                </li>
                <li className="flex items-start">
                  <Calculator className="h-4 w-4 mt-0.5 mr-2 text-neutral-400" />
                  Deductions will be calculated automatically
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateSalary;