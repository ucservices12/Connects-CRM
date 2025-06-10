import React, { useState } from 'react';
import { mockAnalytics } from '../../data/mockData';
import { BarChart3 } from 'lucide-react';

export default function LeadAnalytics() {
    const [chartType, setChartType] = useState('bar');
    const [dateRange, setDateRange] = useState('month');

    const analytics = mockAnalytics;

    return (
        <div>
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights into your lead management performance</p>
                </div>
                <div className="flex space-x-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Sources */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {analytics.leadsBySource.map((source, index) => {
                                const percentage = (source.count / analytics.totalLeads * 100).toFixed(1);
                                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                                return (
                                    <div key={source.source} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                                            <span className="text-sm font-medium text-gray-900">{source.source}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12 text-right">{source.count}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Product Distribution */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Product Distribution</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {analytics.leadsByProduct.map((product, index) => {
                                const percentage = (product.count / analytics.totalLeads * 100).toFixed(1);
                                const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
                                return (
                                    <div key={product.product} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`}></div>
                                            <span className="text-sm font-medium text-gray-900">{product.product}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12 text-right">{product.count}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setChartType('bar')}
                                className={`px-3 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                            >
                                Bar Chart
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={`px-3 py-1 rounded text-sm ${chartType === 'line' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                            >
                                Line Chart
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {analytics.monthlyTrends.map((month, index) => {
                            const maxValue = Math.max(...analytics.monthlyTrends.map(m => m.leads));
                            const leadHeight = (month.leads / maxValue) * 200;
                            const conversionHeight = (month.conversions / maxValue) * 200;

                            return (
                                <div key={month.month} className="flex-1 flex flex-col items-center">
                                    <div className="w-full flex justify-center space-x-1 mb-2">
                                        <div
                                            className="bg-blue-500 rounded-t w-4"
                                            style={{ height: `${leadHeight}px` }}
                                            title={`Leads: ${month.leads}`}
                                        ></div>
                                        <div
                                            className="bg-green-500 rounded-t w-4"
                                            style={{ height: `${conversionHeight}px` }}
                                            title={`Conversions: ${month.conversions}`}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600">{month.month}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm text-gray-600">Leads</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600">Conversions</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
