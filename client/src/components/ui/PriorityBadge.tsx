import React from 'react';
import { Lead } from '../../types';

interface PriorityBadgeProps {
  priority: Lead['priority'];
  size?: 'sm' | 'md';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex rounded-full font-medium ${getPriorityColor(priority)} ${sizeClasses}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;