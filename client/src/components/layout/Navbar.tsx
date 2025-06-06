import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-primary-100 text-primary-800';
    case 'hr': return 'bg-accent-100 text-accent-800';
    case 'manager': return 'bg-success-100 text-success-800';
    default: return 'bg-neutral-100 text-neutral-800';
  }
};

const Navbar = ({ openSidebar }: { openSidebar: () => void }) => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-white border-b border-neutral-200 h-16 flex items-center px-4 md:px-8 shadow-sm">
      {/* Mobile menu */}
      <button onClick={openSidebar} className="md:hidden text-neutral-500 hover:text-primary-600 mr-3">
        <Menu size={26} />
      </button>

      {/* Search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-500"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center ml-auto gap-2">
        {/* Notifications */}
        <button className="relative p-2 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-full">
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-200 border">
              {user?.avatar
                ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                : <User className="w-full h-full p-2 text-neutral-500" />}
            </div>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-3 z-20 border border-neutral-200 animate-fade-in">
              <div className="px-2 py-2 flex items-center gap-2 border-b">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                  {user?.avatar
                    ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    : <User className="w-full h-full p-2 text-neutral-500" />}
                </div>
                <div>
                  <div className="font-semibold text-neutral-800">{user?.name || 'User Name'}</div>
                  <div className="text-xs text-neutral-500">{user?.email}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${getRoleBadgeClass(user?.role || 'employee')}`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Employee'}
                  </span>
                </div>
              </div>
              <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                <User size={16} className="mr-2" /> Profile
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  dispatch(logout());
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-sm text-danger-700 hover:bg-neutral-100 flex items-center"
              >
                <LogOut size={16} className="mr-2" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
