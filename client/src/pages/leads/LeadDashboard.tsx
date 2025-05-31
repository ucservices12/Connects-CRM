import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

// Custom dashboard data
const customStats = {
    successRate: 78,
    avgCallDuration: 4.5,
    totalLeads: 120,
    leadsThisMonth: 30,
    callsMade: 85,
    leadsByStatus: {
        new: 20,
        in_progress: 15,
        contacted: 25,
        qualified: 10,
        proposal: 8,
        closed_won: 30,
        closed_lost: 12
    }
};

const pieData = {
    labels: [
        'New',
        'In Progress',
        'Contacted',
        'Qualified',
        'Proposal',
        'Closed (Won)',
        'Closed (Lost)'
    ],
    datasets: [
        {
            data: Object.values(customStats.leadsByStatus),
            backgroundColor: [
                '#3B82F6', // blue
                '#8B5CF6', // purple
                '#EC4899', // pink
                '#10B981', // green
                '#F59E0B', // amber
                '#6EE7B7', // emerald
                '#EF4444', // red
            ],
            borderWidth: 1,
        },
    ],
};

const barData = {
    labels: ['Total Leads', 'Leads This Month', 'Calls Made'],
    datasets: [
        {
            label: 'Count',
            data: [customStats.totalLeads, customStats.leadsThisMonth, customStats.callsMade],
            backgroundColor: [
                'rgba(59, 130, 246, 0.6)', // blue
                'rgba(139, 92, 246, 0.6)', // purple
                'rgba(16, 185, 129, 0.6)', // green
            ],
            borderColor: [
                'rgb(59, 130, 246)',
                'rgb(139, 92, 246)',
                'rgb(16, 185, 129)',
            ],
            borderWidth: 1,
        },
    ],
};

const LeadDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className='card'>
                <div>
                    <h3 className="text-lg font-medium">Performance Metrics</h3>
                </div>
                <div>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Success Rate:</span>
                            <span className="text-sm font-medium text-gray-900">{customStats.successRate}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Average Call Duration:</span>
                            <span className="text-sm font-medium text-gray-900">{customStats.avgCallDuration} min</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Total Leads:</span>
                            <span className="text-sm font-medium text-gray-900">{customStats.totalLeads}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Leads This Month:</span>
                            <span className="text-sm font-medium text-gray-900">{customStats.leadsThisMonth}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Calls Made:</span>
                            <span className="text-sm font-medium text-gray-900">{customStats.callsMade}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Bar data={barData} />
                    </div>
                </div>
            </div>

            <div className='card'>
                <div>
                    <h3 className="text-lg font-medium">Leads by Status</h3>
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-64 h-64">
                        <Pie data={pieData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDashboard;