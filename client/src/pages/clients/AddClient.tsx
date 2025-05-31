import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Users, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const AddClient = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    status: 'cold',
    assignedTo: '',
    notes: '',
  });

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Real Estate',
    'Other',
  ];

  const statuses = [
    { value: 'cold', label: 'Cold Lead' },
    { value: 'warm', label: 'Warm Lead' },
    { value: 'hot', label: 'Hot Lead' },
    { value: 'converted', label: 'Converted' },
  ];

  // Mock team members for assignment
  const teamMembers = [
    { id: '1', name: 'John Smith', role: 'Sales Representative' },
    { id: '2', name: 'Sarah Johnson', role: 'Account Manager' },
    { id: '3', name: 'Michael Brown', role: 'Sales Manager' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Client added successfully');
      navigate('/clients');
    } catch (error) {
      toast.error('Failed to add client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Add New Client</h1>
        <p className="text-neutral-500">Create a new client profile</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="industry" className="form-label">
                  Industry
                </label>
                <div className="relative">
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website" className="form-label">
                  Website
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="https://"
                  />
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Lead Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Assignment</h2>
            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">
                Assign To
              </label>
              <div className="relative">
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="form-input pl-10"
                  required
                >
                  <option value="">Select Team Member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Address</h2>
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Full Address
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="form-input pl-10"
                  required
                ></textarea>
                <MapPin className="absolute left-3 top-4 h-5 w-5 text-neutral-400" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Additional Notes</h2>
            <div className="form-group">
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="form-input"
                placeholder="Add any additional notes or comments..."
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Client...
                </span>
              ) : (
                'Add Client'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;