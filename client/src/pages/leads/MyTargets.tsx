import React, { useState } from 'react';
import {
    Target,
    TrendingUp,
    Calendar,
    Award,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3
} from 'lucide-react';
import { mockTargets, mockLeads } from '../../data/mockData';
import { useSelector } from 'react-redux';

const MyTargets = () => {
    const user = useSelector((state) => state.auth.user);
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');

    // Filter targets for current user
    const userTargets = mockTargets.filter(target => target.employeeId === "2");
    const userLeads = mockLeads.filter(lead => lead.assignedTo === "2");

    const currentMonthTarget = userTargets.find(t => t.type === 'monthly' && t.status === 'active');
    const currentQuarterTarget = userTargets.find(t => t.type === 'quarterly' && t.status === 'active');

    const getTargetStatus = (target: any) => {
        const progress = (target.achievedValue / target.targetValue) * 100;
        if (progress >= 100) return 'completed';
        if (progress >= 80) return 'on-track';
        if (progress >= 60) return 'behind';
        return 'critical';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'on-track':
                return 'text-blue-600 bg-blue-100';
            case 'behind':
                return 'text-yellow-600 bg-yellow-100';
            case 'critical':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5" />;
            case 'on-track':
                return <TrendingUp className="h-5 w-5" />;
            case 'behind':
                return <Clock className="h-5 w-5" />;
            case 'critical':
                return <AlertCircle className="h-5 w-5" />;
            default:
                return <Target className="h-5 w-5" />;
        }
    };

    const filteredTargets = userTargets.filter(target =>
        selectedPeriod === 'all' || target.type === selectedPeriod
    );

    // Calculate performance metrics
    const completedLeads = userLeads.filter(lead => lead.status === 'Done').length;
    const totalAssigned = userLeads.length;
    const conversionRate = totalAssigned > 0 ? (completedLeads / totalAssigned * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Targets</h1>
                    <p className="text-gray-600 mt-1">Track your performance goals and achievements</p>
                </div>
                <div className="flex space-x-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Periods</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                            <p className="text-3xl font-bold text-gray-900">{totalAssigned}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900">{completedLeads}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                            <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Targets</p>
                            <p className="text-3xl font-bold text-gray-900">{userTargets.filter(t => t.status === 'active').length}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Award className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Targets Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Target */}
                {currentMonthTarget && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Monthly Target</h3>
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getTargetStatus(currentMonthTarget))}`}>
                                {getStatusIcon(getTargetStatus(currentMonthTarget))}
                                <span className="capitalize">{getTargetStatus(currentMonthTarget).replace('-', ' ')}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{currentMonthTarget.achievedValue}/{currentMonthTarget.targetValue} leads</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((currentMonthTarget.achievedValue / currentMonthTarget.targetValue) * 100, 100)}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Period: {currentMonthTarget.period}</span>
                                <span>{((currentMonthTarget.achievedValue / currentMonthTarget.targetValue) * 100).toFixed(1)}% Complete</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                <span>Deadline: {new Date(currentMonthTarget.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quarterly Target */}
                {currentQuarterTarget && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Quarterly Target</h3>
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getTargetStatus(currentQuarterTarget))}`}>
                                {getStatusIcon(getTargetStatus(currentQuarterTarget))}
                                <span className="capitalize">{getTargetStatus(currentQuarterTarget).replace('-', ' ')}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{currentQuarterTarget.achievedValue}/{currentQuarterTarget.targetValue} leads</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((currentQuarterTarget.achievedValue / currentQuarterTarget.targetValue) * 100, 100)}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Period: {currentQuarterTarget.period}</span>
                                <span>{((currentQuarterTarget.achievedValue / currentQuarterTarget.targetValue) * 100).toFixed(1)}% Complete</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                <span>Deadline: {new Date(currentQuarterTarget.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* All Targets */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">All Targets</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Period
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Target
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Achieved
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deadline
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTargets.map((target) => {
                                const progress = (target.achievedValue / target.targetValue) * 100;
                                const status = getTargetStatus(target);

                                return (
                                    <tr key={target.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {target.period}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                {target.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {target.targetValue} leads
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {target.achievedValue} leads
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-900">{progress.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                {getStatusIcon(status)}
                                                <span className="capitalize">{status.replace('-', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(target.deadline).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredTargets.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900">No targets found</p>
                    <p className="text-gray-600 mt-2">Your targets will appear here once they are set by your admin.</p>
                </div>
            )}
        </div>
    );
};

export default MyTargets;