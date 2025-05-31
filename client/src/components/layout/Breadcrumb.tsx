import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    // Don't show breadcrumbs on main dashboard
    if (pathSegments.length === 0 || (pathSegments.length === 2 && pathSegments[0] === 'dashboard')) {
      return [];
    }
    
    const breadcrumbItems = [];
    let path = '';
    
    // Generate breadcrumb items
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      path += `/${segment}`;
      
      // Skip 'dashboard' segment if it's followed by a role
      if (segment === 'dashboard' && i < pathSegments.length - 1 && 
          ['admin', 'hr', 'manager', 'employee'].includes(pathSegments[i + 1])) {
        continue;
      }
      
      // Format segment for display
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle specific segments
      if (segment === 'dashboard') {
        label = 'Dashboard';
      } else if (['admin', 'hr', 'manager', 'employee'].includes(segment) && pathSegments[i-1] === 'dashboard') {
        label = `${label} Dashboard`;
      } else if (segment === 'id' || segment.match(/^[0-9a-fA-F]{8,}$/)) {
        // For ID segments, try to determine what type of item
        const prevSegment = pathSegments[i - 1];
        if (prevSegment === 'employees') {
          label = 'Employee Details';
        } else if (prevSegment === 'clients') {
          label = 'Client Details';
        } else if (prevSegment === 'tasks') {
          label = 'Task Details';
        } else if (prevSegment === 'payslip') {
          label = 'Payslip';
        } else {
          label = 'Details';
        }
      }
      
      breadcrumbItems.push({
        label,
        path,
        isLast: i === pathSegments.length - 1,
      });
    }
    
    return breadcrumbItems;
  }, [location.pathname]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex py-2 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link 
            to="/" 
            className="text-neutral-500 hover:text-primary-600 inline-flex items-center"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={16} className="text-neutral-400" />
            {breadcrumb.isLast ? (
              <span className="ml-1 md:ml-2 text-sm font-medium text-neutral-800" aria-current="page">
                {breadcrumb.label}
              </span>
            ) : (
              <Link 
                to={breadcrumb.path} 
                className="ml-1 md:ml-2 text-sm text-neutral-500 hover:text-primary-600"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;