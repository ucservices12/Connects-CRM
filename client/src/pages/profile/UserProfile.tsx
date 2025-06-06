import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { getRoleBadgeClass } from '../../components/layout/Navbar';
import { updatePassword } from '../../machine/auth';
import { useSelector } from 'react-redux';
import { toast } from '../../components/common/Toaster';

// --- Reusable Components ---
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};
const FormInput: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input {...props} className="form-input" />
  </div>
);

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};
const FormTextArea: React.FC<TextAreaProps> = ({ label, ...props }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <textarea {...props} className="form-input" />
  </div>
);

type CheckboxProps = {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
};
const FormCheckbox: React.FC<CheckboxProps> = ({ name, checked, onChange, title, description }) => (
  <label className="flex items-start">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-primary-600 border-neutral-300 rounded mt-1"
    />
    <span className="ml-3">
      <span className="text-sm font-medium text-neutral-900">{title}</span>
      <p className="text-sm text-neutral-500">{description}</p>
    </span>
  </label>
);

// --- Profile Tab ---
type ProfileData = {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  phone: string;
  emergencyPhone: string;
  pan: string;
  dob: string;
  hireDate: string;
  department: string;
  position: string;
  status: string;
  employeeId: string;
  workLocation: string;
  currentAddress: string;
  permanentAddress: string;
  reporting: string;
  role: string;
};

type Props = {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  user?: any;
};

const ProfileTab: React.FC<Props> = ({ profileData, setProfileData }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile Data:', profileData);
  };

  // Role badge rendering
  const renderRoleBadges = () => {
    if (profileData.role === "admin") {
      return (
        <>
          <span className={`inline w-fit px-2 py-0.5 rounded-full text-xs ${getRoleBadgeClass('admin')}`}>
            Admin
          </span>
          <span className={`inline w-fit px-2 py-0.5 rounded-full text-xs ${getRoleBadgeClass('employee')}`}>
            Employee
          </span>
        </>
      );
    }
    return (
      <span className={`inline w-fit px-2 py-0.5 rounded-full text-xs ${getRoleBadgeClass(profileData.role || 'employee')}`}>
        {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
      </span>
    );
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Role */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Role</h3>
        <div className="flex items-center gap-2">{renderRoleBadges()}</div>
      </div>

      {/* Basic Details */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Basic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-4">
          <FormInput
            label="First Name"
            name="firstName"
            value={profileData.firstName}
            onChange={handleChange}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={profileData.lastName}
            onChange={handleChange}
          />
          <FormInput
            label="Email Address"
            name="email" type="email"
            value={profileData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Reporting"
            name="reporting" type="email"
            value={profileData.reporting} disabled
          />
          <FormInput
            label="Designation"
            name="position"
            value={profileData.position} disabled
          />
          <FormInput
            label="Employee ID"
            name="employeeId"
            value={profileData.employeeId} disabled
          />
          <div className="form-group">
            <label className="form-label">Employee Status</label>
            <span className={`${profileData.status === "active" ? "badge-success" : "badge-primary"}`}>{profileData.status}</span>
          </div>
          <FormInput
            label="Department"
            name="department"
            value={profileData.department}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Personal Details */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-4">
          <FormInput
            label="Personal Email"
            name="personalEmail"
            type="email"
            value={profileData.personalEmail}
            onChange={handleChange}
          />
          <FormInput
            label="PAN"
            name="pan"
            value={profileData.pan}
            onChange={handleChange}
          />
          <FormInput
            label="Date Of Birth"
            name="dob"
            type="date"
            value={profileData.dob}
            onChange={handleChange}
          />
          <FormInput
            label="Date of Hire"
            name="hireDate"
            type="date"
            value={profileData.hireDate}
            onChange={handleChange}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={profileData.phone}
            onChange={handleChange}
          />
          <FormInput
            label="Emergency Phone Number"
            name="emergencyPhone" type="tel"
            value={profileData.emergencyPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-4">
          <FormInput
            label="Work Location"
            name="workLocation"
            value={profileData.workLocation}
            onChange={handleChange}
          />
          <FormTextArea
            label="Current Address"
            name="currentAddress"
            value={profileData.currentAddress}
            onChange={handleChange}
          />
          <FormTextArea
            label="Permanent Address"
            name="permanentAddress"
            value={profileData.permanentAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <button type="submit" className="btn-primary">Save Changes</button>
      </div>
    </form>
  );
};

// --- Security Tab ---
type SecurityData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
type PropSecurityData = {
  securityData: SecurityData;
  setSecurityData: React.Dispatch<React.SetStateAction<SecurityData>>;
};
const SecurityTab: React.FC<PropSecurityData> = ({ securityData, setSecurityData }) => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === "currentPassword" ||
      name === "newPassword" ||
      name === "confirmPassword"
    ) {
      setSecurityData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("New Password and Confirm New Password do not match.");
      return;
    }
    try {
      const data = await updatePassword(securityData);
      if (data.success) {
        console.log("Password updated successfully!");
        toast.success("Update Your Password")
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setError(null);
      }
      if (data.error) {
        setError(data.error);
      }
    } catch (error) {
      setError("Current Password is Incorrect");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Change Password</h3>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 sm:gap-4'>
            {/* Current Password */}
            <div className="relative">
              <FormInput
                label="Current Password"
                type={showPassword.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={securityData.currentPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-2 top-11 -translate-y-1/2 text-neutral-400"
                onClick={() => toggleShowPassword("currentPassword")}
                tabIndex={-1}
              >
                {showPassword.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* New Password */}
            <div className="relative">
              <FormInput
                label="New Password"
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                value={securityData.newPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-2 top-11 -translate-y-1/2 text-neutral-400"
                onClick={() => toggleShowPassword("newPassword")}
                tabIndex={-1}
              >
                {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Confirm New Password */}
            <div className="relative">
              <FormInput
                label="Confirm New Password"
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={securityData.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-2 top-11 -translate-y-1/2 text-neutral-400"
                onClick={() => toggleShowPassword("confirmPassword")}
                tabIndex={-1}
              >
                {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 my-2">{error}</p>}
          <button type="submit" className="btn-primary w-full sm:w-fit">Update Password</button>
        </form>
      </div>
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Two-Factor Authentication</h3>
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-neutral-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-neutral-900">Two-factor authentication is not enabled yet.</h4>
              <p className="text-sm text-neutral-500 mt-1">
                Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
              </p>
              <button className="btn-primary text-sm mt-3">Enable 2FA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Notifications Tab ---
type NotificationData = {
  taskUpdates: boolean;
  leaveRequests: boolean;
  payrollUpdates: boolean;
  securityAlerts: boolean;
  systemUpdates: boolean;
};
type PropsNotificationData = {
  notificationData: NotificationData;
  setNotificationData: React.Dispatch<React.SetStateAction<NotificationData>>;
};
const NotificationsTab: React.FC<PropsNotificationData> = ({ notificationData, setNotificationData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = () => {
    console.log('Notification Data:', notificationData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Email Notifications</h3>
        <div className="sm:space-y-4 space-y-2">
          <FormCheckbox
            name="taskUpdates"
            checked={notificationData.taskUpdates}
            onChange={handleChange}
            title="Task Updates"
            description="Receive notifications when tasks are assigned or updated"
          />
          <FormCheckbox
            name="leaveRequests"
            checked={notificationData.leaveRequests}
            onChange={handleChange}
            title="Leave Requests"
            description="Receive notifications about leave request status"
          />
          <FormCheckbox
            name="payrollUpdates"
            checked={notificationData.payrollUpdates}
            onChange={handleChange}
            title="Payroll Updates"
            description="Receive notifications when salary is processed"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-neutral-900 mb-4">System Notifications</h3>
        <div className="sm:space-y-4 space-y-2">
          <FormCheckbox
            name="securityAlerts"
            checked={notificationData.securityAlerts}
            onChange={handleChange}
            title="Security Alerts"
            description="Receive notifications about security updates and login attempts"
          />
          <FormCheckbox
            name="systemUpdates"
            checked={notificationData.systemUpdates}
            onChange={handleChange}
            title="System Updates"
            description="Receive notifications about system maintenance and updates"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="btn-primary" onClick={handleSubmit}>Save Preferences</button>
      </div>
    </div>
  );
};

// --- Main UserProfile Component ---
const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('profile');

  // Separate form states
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
    personalEmail: '',
    phone: '',
    emergencyPhone: '',
    pan: '',
    dob: '',
    hireDate: '',
    department: '',
    position: '',
    status: '',
    employeeId: '',
    workLocation: '',
    currentAddress: '',
    permanentAddress: '',
    reporting: '',
    role: '',
  });

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationData, setNotificationData] = useState<NotificationData>({
    taskUpdates: false,
    leaveRequests: false,
    payrollUpdates: false,
    securityAlerts: false,
    systemUpdates: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: user?.department || '',
        position: user?.position || '',
        workLocation: user?.workLocation || '',
        currentAddress: user?.currentAddress || '',
        permanentAddress: user?.permanentAddress || '',
        status: user?.status || 'active',
        employeeId: user?.employeeId || '',
        reporting: user?.reporting || '',
        role: user?.role || 'employee',
        personalEmail: user?.personalEmail || '',
        emergencyPhone: user?.emergencyPhone || '',
        pan: user?.pan || '',
        dob: user?.dob || '',
        hireDate: user?.hireDate || '',
      }));
    }
  }, [user]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-500">Manage your account settings and preferences</p>
      </div>
      <div className="card sm:p-6 p-1">
        {/* Tabs */}
        <div className="border-b border-neutral-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'profile'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
                }`}
            >
              <User size={16} className="inline-block mr-1" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'security'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
                }`}
            >
              <Lock size={16} className="inline-block mr-1" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'notifications'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700'
                }`}
            >
              <Bell size={16} className="inline-block mr-1" />
              Notifications
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileTab
              profileData={profileData}
              setProfileData={setProfileData}
              user={user}
            />
          )}
          {activeTab === 'security' && (
            <SecurityTab
              securityData={securityData}
              setSecurityData={setSecurityData}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab
              notificationData={notificationData}
              setNotificationData={setNotificationData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;