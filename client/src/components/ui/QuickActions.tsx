import { Plus, Phone, FileText, Users } from 'lucide-react';
import { useSelector } from 'react-redux';

const QuickActions = () => {
  const user = useSelector((state) => state.auth.user);

  const adminActions = [
    { icon: Plus, label: 'Add Lead', action: () => console.log('Add Lead') },
    { icon: Users, label: 'Add Employee', action: () => console.log('Add Employee') },
    { icon: FileText, label: 'Generate Report', action: () => console.log('Generate Report') },
    { icon: Phone, label: 'Bulk Call', action: () => console.log('Bulk Call') },
  ];

  const employeeActions = [
    { icon: Phone, label: 'Make Call', action: () => console.log('Make Call') },
    { icon: FileText, label: 'Add Note', action: () => console.log('Add Note') },
    { icon: Plus, label: 'Upload Doc', action: () => console.log('Upload Doc') },
  ];

  const actions = user?.role === 'admin' ? adminActions : employeeActions;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <action.icon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;