import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null as File | null,
  });

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        attachment: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Leave request submitted successfully');
      navigate('/leaves/history');
    } catch (error) {
      toast.error('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Apply for Leave</h1>
        <p className="text-neutral-500">Submit a new leave request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="leaveType" className="form-label">
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    id="leaveType"
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="form-input pl-10"
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="form-input pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="form-input pl-10"
                      required
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reason" className="form-label">
                  Reason for Leave
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="form-input"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="attachment" className="form-label">
                  Attachment (if any)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-neutral-600">
                      <label
                        htmlFor="attachment"
                        className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="attachment"
                          name="attachment"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-neutral-500">
                      PDF, DOC up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => navigate('/leaves/history')}
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
                      Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            
            </form>
          </div>
        </div>

        {/* Leave Balance */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Leave Balance</h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary-50 border border-primary-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-primary-900">Annual Leave</div>
                  <div className="text-sm text-primary-600">21 days total</div>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '57%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="text-primary-600">12 days taken</div>
                  <div className="text-primary-900 font-medium">9 days remaining</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent-50 border border-accent-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-accent-900">Sick Leave</div>
                  <div className="text-sm text-accent-600">14 days total</div>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '21%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="text-accent-600">3 days taken</div>
                  <div className="text-accent-900 font-medium">11 days remaining</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-success-50 border border-success-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-success-900">Emergency Leave</div>
                  <div className="text-sm text-success-600">7 days total</div>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div className="bg-success-600 h-2 rounded-full" style={{ width: '14%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <div className="text-success-600">1 day taken</div>
                  <div className="text-success-900 font-medium">6 days remaining</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Leave Policy</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-start">
                  <Clock size={16} className="mr-2 mt-0.5 text-neutral-400" />
                  Submit requests at least 3 days in advance
                </li>
                <li className="flex items-start">
                  <FileText size={16} className="mr-2 mt-0.5 text-neutral-400" />
                  Attach supporting documents for sick leave
                </li>
                <li className="flex items-start">
                  <Calendar size={16} className="mr-2 mt-0.5 text-neutral-400" />
                  Leave year runs from Jan to Dec
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;