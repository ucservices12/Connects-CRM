import { Activity, Clock } from 'lucide-react';
import { mockActivities } from '../../data/mockData';
import { useSelector } from 'react-redux';

const RecentActivities = () => {
  const user = useSelector((state) => state.auth.user);

  // Show all activities for admin, only user's activities for employee
  const activities = user?.role === 'admin'
    ? mockActivities.slice(0, 5)
    : mockActivities.filter(a => a.userId === user?.id).slice(0, 5);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'Called':
        return '📞';
      case 'Updated Status':
        return '📝';
      case 'Uploaded Document':
        return '📄';
      case 'Assigned Lead':
        return '👤';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No recent activities</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">
                    {getActivityIcon(activity.action)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.userName}</span>{' '}
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;