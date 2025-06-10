import React, { useState } from 'react';
import {
    Users,
    ClipboardList,
    TrendingUp,
    Calendar,
    DollarSign,
    Target,
    Clock,
    Award,
    BarChart3,
} from 'lucide-react';
import { mockLeads, mockEmployees, mockAnalytics } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import QuickActions from '../../components/ui/QuickActions';
import RecentActivities from '../../components/ui/RecentActivities';

const AdminLeadDashboard = () => {
    const [dateFilter, setDateFilter] = useState('today');
    const [productFilter, setProductFilter] = useState('all');
    const [dateRange, setDateRange] = useState('month');

    const analytics = mockAnalytics;

    const leadStats = {
        total: mockLeads.length,
        new: mockLeads.filter(lead => lead.status === 'New').length,
        inProgress: mockLeads.filter(lead => lead.status === 'In Progress').length,
        approved: mockLeads.filter(lead => lead.status === 'Approved').length,
        done: mockLeads.filter(lead => lead.status === 'Done').length,
        rejected: mockLeads.filter(lead => lead.status === 'Rejected').length,
    };

    const recentLeads = mockLeads.slice(0, 5);
    const totalLoanAmount = mockLeads.reduce((sum, lead) => sum + lead.loanAmount, 0);
    const avgLoanAmount = totalLoanAmount / mockLeads.length;

    return (
        <div className="space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights into your lead management performance</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex space-x-3">
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
                        <select
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Products</option>
                            <option value="Personal Loan">Personal Loan</option>
                            <option value="Home Loan">Home Loan</option>
                            <option value="Business Loan">Business Loan</option>
                            <option value="Car Loan">Car Loan</option>
                            <option value="Education Loan">Education Loan</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Leads</p>
                            <p className="text-3xl font-bold text-gray-900">{leadStats.total}</p>
                            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
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
                            <p className="text-3xl font-bold text-gray-900">{mockAnalytics.conversionRate}%</p>
                            <p className="text-sm text-green-600 mt-1">+5% from last month</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Target className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                            <p className="text-3xl font-bold text-gray-900">{mockAnalytics.averageResponseTime}h</p>
                            <p className="text-sm text-red-600 mt-1">+0.5h from last month</p>
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
                            <p className="text-3xl font-bold text-gray-900">${(totalLoanAmount / 1000000).toFixed(1)}M</p>
                            <p className="text-sm text-green-600 mt-1">+18% from last month</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lead Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New</p>
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
                            <p className="text-2xl font-bold text-purple-600">{leadStats.done}</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <ClipboardList className="h-5 w-5 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{leadStats.rejected}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-full">
                            <Users className="h-5 w-5 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">On Hold</p>
                            <p className="text-2xl font-bold text-gray-600">
                                {mockLeads.filter(lead => lead.status === 'On Hold').length}
                            </p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <Clock className="h-5 w-5 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leads */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
                    </div>
                    <div className="p-6">
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
                                            <p className="text-xs text-gray-500">Assigned to: {lead.assignedToName}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        <StatusBadge status={lead.status} size="sm" />
                                        <PriorityBadge priority={lead.priority} size="sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Activities */}
                <div className="space-y-6">
                    <QuickActions />
                    <RecentActivities />
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analytics.topPerformers.map((performer, index) => (
                            <div key={performer.id} className="text-center">
                                <div className="relative">
                                    <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-white font-bold text-lg">
                                            {performer.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                                            <span className="text-xs">👑</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-semibold text-gray-900">{performer.name}</h4>
                                <p className="text-sm text-gray-600">{performer.designation}</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                        <span className="text-gray-600">Conversion:</span>
                                        <span className="font-medium text-green-600 ml-1">{performer.conversionRate}%</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="font-medium ml-1">{performer.completedLeads}/{performer.assignedLeads}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Employee Performance */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Employee Performance</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mockEmployees.filter(emp => emp.isActive).map((employee) => (
                            <div key={employee.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                            {employee.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{employee.name}</p>
                                        <p className="text-sm text-gray-600">{employee.designation}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Assigned:</span>
                                        <span className="font-medium">{employee.assignedLeads}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="font-medium text-green-600">{employee.completedLeads}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Conversion:</span>
                                        <span className="font-medium text-blue-600">{employee.conversionRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(employee.completedLeads / employee.targetLeads) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">
                                        {employee.completedLeads}/{employee.targetLeads} target
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLeadDashboard;