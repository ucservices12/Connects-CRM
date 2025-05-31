import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Mail, Printer, Share2, Building2, Phone, Mail as MailIcon } from 'lucide-react';
import { format } from 'date-fns';

// Mock payslip data
const payslipData = {
  id: '1',
  month: '2023-10',
  employee: {
    id: '1',
    name: 'John Smith',
    position: 'Senior Software Developer',
    department: 'IT',
    joinDate: '2023-01-15',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    bankAccount: '**** **** **** 1234',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  company: {
    name: 'TechCorp Inc.',
    address: '123 Tech Street, Silicon Valley, CA 94025',
    phone: '+1 (555) 987-6543',
    email: 'hr@techcorp.com',
    logo: 'https://placehold.co/200x60?text=TechCorp',
  },
  salary: {
    basic: 85000,
    houseRent: 2500,
    medical: 1000,
    transport: 800,
    bonus: 700,
    overtime: 0,
    totalEarnings: 90000,
    tax: 1800,
    insurance: 400,
    providentFund: 300,
    totalDeductions: 2500,
    netPayable: 87500,
  },
  attendance: {
    workingDays: 22,
    present: 21,
    absent: 1,
    leaves: 0,
    overtime: 0,
  },
};

const PayslipDownload = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [payslip, setPayslip] = useState(payslipData);
  
  useEffect(() => {
    // Simulate API call
    const fetchPayslip = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPayslip(payslipData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayslip();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Payslip</h1>
          <p className="text-neutral-500">
            {format(new Date(payslip.month), 'MMMM yyyy')}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button className="btn-outline">
            <Mail size={18} className="mr-1" />
            Email
          </button>
          <button className="btn-outline">
            <Printer size={18} className="mr-1" />
            Print
          </button>
          <button className="btn-outline">
            <Share2 size={18} className="mr-1" />
            Share
          </button>
          <button className="btn-primary">
            <Download size={18} className="mr-1" />
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 pb-6 mb-6">
          <div className="flex items-center">
            <img
              src={payslip.company.logo}
              alt={payslip.company.name}
              className="h-12"
            />
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <h2 className="text-2xl font-bold text-neutral-900">PAYSLIP</h2>
            <p className="text-neutral-500">
              {format(new Date(payslip.month), 'MMMM yyyy')}
            </p>
          </div>
        </div>
        
        {/* Company & Employee Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Company Information</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <Building2 size={16} className="mt-1 mr-2 text-neutral-400" />
                <div>
                  <div className="font-medium text-neutral-900">{payslip.company.name}</div>
                  <div className="text-sm text-neutral-500">{payslip.company.address}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-neutral-400" />
                <span className="text-neutral-600">{payslip.company.phone}</span>
              </div>
              <div className="flex items-center">
                <MailIcon size={16} className="mr-2 text-neutral-400" />
                <span className="text-neutral-600">{payslip.company.email}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Employee Information</h3>
            <div className="flex items-start">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={payslip.employee.avatar}
                  alt={payslip.employee.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-3">
                <div className="font-medium text-neutral-900">{payslip.employee.name}</div>
                <div className="text-sm text-neutral-500">{payslip.employee.position}</div>
                <div className="text-sm text-neutral-500">{payslip.employee.department}</div>
                <div className="text-sm text-neutral-500 mt-1">
                  Joined: {format(new Date(payslip.employee.joinDate), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Salary Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Earnings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Basic Salary</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.basic.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">House Rent Allowance</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.houseRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Medical Allowance</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.medical.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Transport Allowance</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.transport.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Performance Bonus</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.bonus.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Overtime</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.overtime.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 font-medium text-lg">
                <span className="text-neutral-900">Total Earnings</span>
                <span className="text-success-600">
                  ${payslip.salary.totalEarnings.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Deductions */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Deductions</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Income Tax</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Insurance</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.insurance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Provident Fund</span>
                <span className="font-medium text-neutral-900">
                  ${payslip.salary.providentFund.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 font-medium text-lg">
                <span className="text-neutral-900">Total Deductions</span>
                <span className="text-danger-600">
                  ${payslip.salary.totalDeductions.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Net Payable */}
            <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-primary-900">Net Payable</span>
                <span className="text-2xl font-bold text-primary-900">
                  ${payslip.salary.netPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attendance Summary */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="text-sm text-neutral-500">Working Days</div>
              <div className="text-xl font-bold text-neutral-900 mt-1">
                {payslip.attendance.workingDays}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-success-50 border border-success-200">
              <div className="text-sm text-success-600">Present Days</div>
              <div className="text-xl font-bold text-success-900 mt-1">
                {payslip.attendance.present}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
              <div className="text-sm text-danger-600">Absent Days</div>
              <div className="text-xl font-bold text-danger-900 mt-1">
                {payslip.attendance.absent}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
              <div className="text-sm text-warning-600">Leave Days</div>
              <div className="text-xl font-bold text-warning-900 mt-1">
                {payslip.attendance.leaves}
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-accent-50 border border-accent-200">
              <div className="text-sm text-accent-600">Overtime Hours</div>
              <div className="text-xl font-bold text-accent-900 mt-1">
                {payslip.attendance.overtime}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-200 text-sm text-neutral-500">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>For any queries, please contact the HR department.</p>
        </div>
      </div>
    </div>
  );
};

export default PayslipDownload;