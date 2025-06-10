import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Eye
} from 'lucide-react';
import { mockLeads } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import { useSelector } from 'react-redux';

const EmployeeLeads = () => {
    const user = useSelector((state) => state.auth.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter leads assigned to current employee
    const assignedLeads = mockLeads.filter(lead => lead.assignedTo === "1" || user?._id);

    const filteredLeads = assignedLeads.filter(lead => {
        const matchesSearch = lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const leadStats = {
        total: assignedLeads.length,
        new: assignedLeads.filter(lead => lead.status === 'New').length,
        inProgress: assignedLeads.filter(lead => lead.status === 'In Progress').length,
        completed: assignedLeads.filter(lead => lead.status === 'Done').length,
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Leads</h1>
                    <p className="text-gray-600 mt-1">Manage your assigned leads</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                            <p className="text-3xl font-bold text-gray-900">{leadStats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Leads</p>
                            <p className="text-3xl font-bold text-blue-600">{leadStats.new}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-3xl font-bold text-yellow-600">{leadStats.inProgress}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Filter className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{leadStats.completed}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads by name, phone, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Approved">Approved</option>
                        <option value="Done">Done</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Leads List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assigned Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {lead.customerName.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{lead.customerName}</div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {lead.city}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                            {lead.phone}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            {lead.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{lead.productType}</div>
                                        <div className="text-sm text-gray-500">${lead.loanAmount.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={lead.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <PriorityBadge priority={lead.priority} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/lead/${lead.id}`}
                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredLeads.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900">No leads found</p>
                    <p className="text-gray-600 mt-2">Try adjusting your search criteria or filters.</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeLeads;