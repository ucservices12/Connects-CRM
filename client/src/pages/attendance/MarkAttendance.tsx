import { useState } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MarkAttendance = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'in' | 'out'>('in');
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  
  const today = new Date();
  const currentTime = format(today, 'HH:mm:ss');
  
  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setLocationError('');
      },
      () => {
        setLocationError('Unable to retrieve your location');
      }
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!location) {
      toast.error('Please enable location access');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Attendance marked successfully - ${attendanceType.toUpperCase()}`);
      
      // Reset form
      setAttendanceType('in');
      setLocation(null);
    } catch (error) {
      toast.error('Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Mark Attendance</h1>
        <p className="text-neutral-500">Record your daily attendance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Time & Date */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-primary-50 rounded-lg border border-primary-100">
                <Clock className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-sm text-neutral-500 mb-1">Current Time</div>
                <div className="text-3xl font-bold text-primary-900">{currentTime}</div>
              </div>
              
              <div className="text-center p-6 bg-accent-50 rounded-lg border border-accent-100">
                <Calendar className="h-8 w-8 text-accent-600 mx-auto mb-2" />
                <div className="text-sm text-neutral-500 mb-1">Today's Date</div>
                <div className="text-3xl font-bold text-accent-900">
                  {format(today, 'dd MMM yyyy')}
                </div>
              </div>
            </div>
            
            {/* Location Status */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-neutral-600">
                  <MapPin size={16} className="mr-1" />
                  Location Status
                </div>
                <button
                  onClick={getCurrentLocation}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Refresh Location
                </button>
              </div>
              
              {locationError ? (
                <div className="p-4 bg-danger-50 text-danger-700 rounded-lg border border-danger-200">
                  {locationError}
                </div>
              ) : location ? (
                <div className="p-4 bg-success-50 text-success-700 rounded-lg border border-success-200">
                  Location access granted
                </div>
              ) : (
                <div className="p-4 bg-warning-50 text-warning-700 rounded-lg border border-warning-200">
                  Click 'Refresh Location' to enable location access
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mark Attendance Form */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Mark Attendance</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Attendance Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttendanceType('in')}
                    className={`p-3 text-center rounded-lg border ${
                      attendanceType === 'in'
                        ? 'bg-success-50 border-success-200 text-success-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Clock In
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAttendanceType('out')}
                    className={`p-3 text-center rounded-lg border ${
                      attendanceType === 'out'
                        ? 'bg-danger-50 border-danger-200 text-danger-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Clock Out
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full btn ${
                  attendanceType === 'in' ? 'btn-success' : 'btn-danger'
                }`}
                disabled={isSubmitting || !location}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Mark ${attendanceType === 'in' ? 'Clock In' : 'Clock Out'}`
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-sm text-neutral-500">
            <p className="mb-2">Note:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Location access is required to mark attendance</li>
              <li>Make sure you are within office premises</li>
              <li>Contact HR for any attendance related issues</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Recent Attendance */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Recent Attendance</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {[
                  {
                    date: '2023-10-16',
                    clockIn: '09:00:00',
                    clockOut: '18:00:00',
                    totalHours: '9:00',
                    status: 'Present',
                  },
                  {
                    date: '2023-10-15',
                    clockIn: '09:15:00',
                    clockOut: '18:30:00',
                    totalHours: '9:15',
                    status: 'Present',
                  },
                  {
                    date: '2023-10-14',
                    clockIn: '09:30:00',
                    clockOut: '17:45:00',
                    totalHours: '8:15',
                    status: 'Present',
                  },
                ].map((record, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {format(new Date(record.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {record.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {record.clockOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {record.totalHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800 px-2 py-1">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;