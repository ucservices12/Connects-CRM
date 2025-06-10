import React, { useState } from 'react';
import {
    ClipboardList,
    TrendingUp,
    Calendar,
    Target,
    Phone,
    Clock,
    Award,
    DollarSign
} from 'lucide-react';
import { mockLeads } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import QuickActions from '../../components/ui/QuickActions';
import RecentActivities from '../../components/ui/RecentActivities';
import { useSelector } from 'react-redux';

const EmployeeLeadDashboard = () => {
    const user = useSelector((state) => state.auth.user);
    const [dateFilter, setDateFilter] = useState('today');

    // Filter leads assigned to current employee
    const assignedLeads = mockLeads.filter(lead => lead.assignedTo === "1" || user?._id);

    const leadStats = {
        total: assignedLeads.length,
        new: assignedLeads.filter(lead => lead.status === 'New').length,
        inProgress: assignedLeads.filter(lead => lead.status === 'In Progress').length,
        completed: assignedLeads.filter(lead => lead.status === 'Done').length,
        approved: assignedLeads.filter(lead => lead.status === 'Approved').length,
    };

    const totalLoanValue = assignedLeads.reduce((sum, lead) => sum + lead.loanAmount, 0);
    const conversionRate = leadStats.total > 0 ? ((leadStats.completed + leadStats.approved) / leadStats.total * 100).toFixed(1) : 0;
    const recentLeads = assignedLeads.slice(0, 4);

    // Mock targets
    const monthlyTarget = 25;
    const targetProgress = (leadStats.total / monthlyTarget * 100).toFixed(1);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your performance overview.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                    </select>
                </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                            <p className="text-3xl font-bold text-gray-900">{leadStats.total}</p>
                            <p className="text-sm text-blue-600 mt-1">{targetProgress}% of target</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <ClipboardList className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                            <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
                            <p className="text-sm text-green-600 mt-1">Above average</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Award className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Follow-ups</p>
                            <p className="text-3xl font-bold text-gray-900">{leadStats.new + leadStats.inProgress}</p>
                            <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Loan Value</p>
                            <p className="text-3xl font-bold text-gray-900">${(totalLoanValue / 1000).toFixed(0)}K</p>
                            <p className="text-sm text-purple-600 mt-1">This month</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Leads</p>
                            <p className="text-2xl font-bold text-blue-600">{leadStats.new}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-yellow-600">{leadStats.inProgress}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Calendar className="h-5 w-5 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Approved</p>
                            <p className="text-2xl font-bold text-green-600">{leadStats.approved}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full">
                            <Award className="h-5 w-5 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-purple-600">{leadStats.completed}</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <ClipboardList className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Monthly Target Progress</h3>
                    <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">{leadStats.total}/{monthlyTarget} leads</span>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(parseFloat(targetProgress), 100)}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>0</span>
                    <span className="font-medium">{targetProgress}% Complete</span>
                    <span>{monthlyTarget}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">My Recent Leads</h2>
                    </div>
                    <div className="p-6">
                        {recentLeads.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p>No leads assigned yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg px-3 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium text-sm">
                                                    {lead.customerName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{lead.customerName}</p>
                                                <p className="text-sm text-gray-600">{lead.productType} - ${lead.loanAmount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">{lead.city}, {lead.state}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1">
                                            <StatusBadge status={lead.status} size="sm" />
                                            <PriorityBadge priority={lead.priority} size="sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Activities */}
                <div className="space-y-6">
                    <QuickActions />
                    <RecentActivities />
                </div>
            </div>
        </div>
    );
};

export default EmployeeLeadDashboard;