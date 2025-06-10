import React, { useState } from 'react';
import {
    Activity,
    Search,
    Calendar,
    Phone,
    FileText,
    MessageSquare,
    Download,
    Clock,
    Filter
} from 'lucide-react';
import { mockActivities } from '../../data/mockData';
import { useSelector } from 'react-redux';

const MyActivities = () => {
    const user = useSelector((state) => state.auth.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAction, setSelectedAction] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    // Filter activities for current user
    const userActivities = mockActivities.filter(activity => activity.userId === "2" || user?.id);

    const actionTypes = [
        'Called', 'Updated Status', 'Uploaded Document', 'Downloaded Zip', 'Added Comment'
    ];

    const getActivityIcon = (action: string) => {
        switch (action) {
            case 'Called':
                return <Phone className="h-5 w-5 text-green-600" />;
            case 'Updated Status':
                return <Activity className="h-5 w-5 text-blue-600" />;
            case 'Uploaded Document':
                return <FileText className="h-5 w-5 text-purple-600" />;
            case 'Downloaded Zip':
                return <Download className="h-5 w-5 text-indigo-600" />;
            case 'Added Comment':
                return <MessageSquare className="h-5 w-5 text-yellow-600" />;
            default:
                return <Activity className="h-5 w-5 text-gray-600" />;
        }
    };

    const getActivityColor = (action: string) => {
        switch (action) {
            case 'Called':
                return 'bg-green-100 border-green-200';
            case 'Updated Status':
                return 'bg-blue-100 border-blue-200';
            case 'Uploaded Document':
                return 'bg-purple-100 border-purple-200';
            case 'Downloaded Zip':
                return 'bg-indigo-100 border-indigo-200';
            case 'Added Comment':
                return 'bg-yellow-100 border-yellow-200';
            default:
                return 'bg-gray-100 border-gray-200';
        }
    };

    const filteredActivities = userActivities.filter(activity => {
        const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = selectedAction === 'all' || activity.action === selectedAction;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const activityDate = new Date(activity.createdAt);
            const now = new Date();

            switch (dateFilter) {
                case 'today':
                    matchesDate = activityDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = activityDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = activityDate >= monthAgo;
                    break;
            }
        }

        return matchesSearch && matchesAction && matchesDate;
    });

    const activityStats = {
        total: userActivities.length,
        today: userActivities.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString()).length,
        thisWeek: userActivities.filter(a => {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return new Date(a.createdAt) >= weekAgo;
        }).length,
        calls: userActivities.filter(a => a.action === 'Called').length
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Activities</h1>
                    <p className="text-gray-600 mt-1">Track your daily activities and performance</p>
                </div>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Activities</p>
                            <p className="text-3xl font-bold text-gray-900">{activityStats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Today</p>
                            <p className="text-3xl font-bold text-gray-900">{activityStats.today}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">This Week</p>
                            <p className="text-3xl font-bold text-gray-900">{activityStats.thisWeek}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Calls Made</p>
                            <p className="text-3xl font-bold text-gray-900">{activityStats.calls}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Phone className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Actions</option>
                        {actionTypes.map((action) => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>

            {/* Activities Timeline */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Activity Timeline</h2>
                </div>
                <div className="p-6">
                    {filteredActivities.length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-xl font-medium text-gray-900">No activities found</p>
                            <p className="text-gray-600 mt-2">Try adjusting your filters to see more activities.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredActivities.map((activity, index) => (
                                <div key={activity.id} className="relative">
                                    {index !== filteredActivities.length - 1 && (
                                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                                    )}
                                    <div className={`flex items-start space-x-4 p-4 rounded-lg border ${getActivityColor(activity.action)}`}>
                                        <div className="flex-shrink-0">
                                            <div className="p-2 bg-white rounded-full border-2 border-current">
                                                {getActivityIcon(activity.action)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-700">{activity.action}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-1">{activity.description}</p>
                                            {activity.metadata && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    {activity.metadata.duration && (
                                                        <span>Duration: {Math.floor(activity.metadata.duration / 60)}:{(activity.metadata.duration % 60).toString().padStart(2, '0')}</span>
                                                    )}
                                                    {activity.metadata.status && (
                                                        <span className="ml-4">Status: {activity.metadata.status}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyActivities;