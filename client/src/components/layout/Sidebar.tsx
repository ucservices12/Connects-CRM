import { Link, useLocation } from 'react-router-dom';
import {
  X, Users, BarChart3, Building2, CheckSquare, CalendarClock,
  FileText, Package, ClipboardList, Briefcase, PieChart,
  Receipt, AlertTriangle, Settings, History,
  RefreshCw
} from 'lucide-react';
import { useSelector } from 'react-redux';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // Define sidebar links based on user role
  const getNavLinks = () => {
    const links = [
      {
        section: 'Main',
        items: [
          {
            name: 'Dashboard',
            path: user?.role ? `/dashboard/${user.role}` : '/dashboard/employee',
            icon: <BarChart3 size={20} />,
            allowedRoles: ['admin', 'hr', 'manager', 'employee'],
          },
        ],
      },
      {
        section: 'Management',
        items: [
          {
            name: 'Employees',
            path: '/employees',
            icon: <Users size={20} />,
            allowedRoles: ['admin', 'hr'],
          },
          {
            name: 'Clients',
            path: '/clients',
            icon: <Building2 size={20} />,
            allowedRoles: ['admin', 'manager'],
          },
          {
            name: 'Tasks',
            path: '/tasks/my-tasks',
            icon: <CheckSquare size={20} />,
            allowedRoles: ['admin', 'hr', 'manager', 'employee'],
          },
          {
            name: 'Task Board',
            path: '/tasks/board',
            icon: <ClipboardList size={20} />,
            allowedRoles: ['admin', 'hr', 'manager', 'employee'],
          },
          {
            name: 'Attendance',
            path: '/attendance/mark',
            icon: <CalendarClock size={20} />,
            allowedRoles: ['admin', 'hr', 'manager', 'employee'],
          },
          {
            name: 'Leave Requests',
            path: '/leaves/apply',
            icon: <FileText size={20} />,
            allowedRoles: ['admin', 'hr', 'manager', 'employee'],
          },
        ],
      },
      {
        section: 'Leads',
        items: [
          {
            name: 'Dashboard',
            path: '/leads/dashboard',
            icon: <Building2 size={20} />,
            allowedRoles: ['admin', 'manager', 'employee'],
          },
          {
            name: 'Calls',
            path: '/leads/Calls',
            icon: <Building2 size={20} />,
            allowedRoles: ['admin', 'manager', 'employee'],
          },
        ],
      },
      {
        section: 'HR',
        items: [
          {
            name: 'Salary',
            path: '/salary/list',
            icon: <Briefcase size={20} />,
            allowedRoles: ['admin', 'hr'],
          },
          {
            name: 'Assets',
            path: '/assets/list',
            icon: <Package size={20} />,
            allowedRoles: ['admin', 'hr'],
          },
        ],
      },
      {
        section: 'Invoices',
        items: [
          {
            name: 'Invoice Dashboard',
            path: '/invoices',
            icon: <Receipt size={20} />,
            allowedRoles: ['admin'],
          },
          {
            name: 'All Invoices',
            path: '/invoices/list',
            icon: <FileText size={20} />,
            allowedRoles: ['admin'],
          },
          {
            name: 'Overdue Invoices',
            path: '/invoices/overdue',
            icon: <AlertTriangle size={20} />,
            allowedRoles: ['admin'],
          },
          {
            name: 'Recurring Invoices',
            path: '/invoices/recurring',
            icon: <RefreshCw size={20} />,
            allowedRoles: ['admin'],
          },
          {
            name: 'Invoice History',
            path: '/invoices/history',
            icon: <History size={20} />,
            allowedRoles: ['admin'],
          },
          {
            name: 'Invoice Settings',
            path: '/invoices/settings',
            icon: <Settings size={20} />,
            allowedRoles: ['admin'],
          },
        ],
      },
      {
        section: 'SETTINGS',
        items: [
          {
            name: 'Permission Route',
            path: '/dashboard/permissions',
            icon: <Briefcase size={20} />,
            allowedRoles: ['admin'],
          },
          {
            name: 'Settings',
            path: '/dashboard/setting',
            icon: <Package size={20} />,
            allowedRoles: ['admin'],
          },
        ],
      },
      {
        section: 'Reports',
        items: [
          {
            name: 'Reports Dashboard',
            path: '/reports/dashboard',
            icon: <PieChart size={20} />,
            allowedRoles: ['admin', 'hr', 'manager'],
          },
        ],
      },
    ];

    // Filter links based on user role
    return links.map(section => ({
      ...section,
      items: section.items.filter(item =>
        user && item.allowedRoles.includes(user.role)
      ),
    })).filter(section => section.items.length > 0);
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className={`z-30 w-64 fixed inset-y-0 bg-white border-r border-neutral-200 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
        <Link to="/" className="flex items-center space-x-2">
          <BarChart3 size={24} className="h-8 w-8 text-primary-600" />
          <span className="text-lg font-semibold text-neutral-900">ConnectCRM</span>
        </Link>
        <button
          onClick={closeSidebar}
          className="md:hidden text-neutral-500 hover:text-neutral-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        <nav className="px-4 py-4">
          {navLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;