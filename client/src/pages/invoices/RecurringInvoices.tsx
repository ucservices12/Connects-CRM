import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, PlusCircle, Calendar, Copy, Edit,
    Trash2, Clock, CheckCircle, XCircle, Eye, RefreshCw
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';

interface RecurringInvoice {
    id: string;
    name: string;
    client: {
        id: string;
        name: string;
        company: string;
    };
    amount: number;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDate: string;
    lastDate: string | null;
    status: 'active' | 'paused' | 'completed';
    createdInvoices: number;
}

const RecurringInvoices = () => {
    const [invoices, setInvoices] = useState<RecurringInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        setTimeout(() => {
            const mockInvoices: RecurringInvoice[] = Array.from({ length: 8 }, (_, i) => {
                const statuses: Array<'active' | 'paused' | 'completed'> = ['active', 'paused', 'completed'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                const frequencies: Array<'weekly' | 'monthly' | 'quarterly' | 'yearly'> = ['weekly', 'monthly', 'quarterly', 'yearly'];
                const randomFrequency = frequencies[Math.floor(Math.random() * frequencies.length)];

                const clients = [
                    { id: '1', name: 'John Smith', company: 'Acme Corporation' },
                    { id: '2', name: 'Sarah Johnson', company: 'Globex Industries' },
                    { id: '3', name: 'Tony Stark', company: 'Stark Enterprises' },
                    { id: '4', name: 'Bruce Wayne', company: 'Wayne Industries' },
                    { id: '5', name: 'Albert Wesker', company: 'Umbrella Corp' }
                ];
                const randomClient = clients[Math.floor(Math.random() * clients.length)];

                const today = new Date();
                const nextDate = new Date(today);

                if (randomFrequency === 'weekly') {
                    nextDate.setDate(nextDate.getDate() + (7 - nextDate.getDay() + 1) % 7); // Next Monday
                } else if (randomFrequency === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    nextDate.setDate(1);
                } else if (randomFrequency === 'quarterly') {
                    nextDate.setMonth(nextDate.getMonth() + 3);
                    nextDate.setDate(1);
                } else {
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    nextDate.setMonth(0);
                    nextDate.setDate(1);
                }

                let lastDate = null;
                if (Math.random() > 0.3) {
                    const lastInvoiceDate = new Date(today);
                    lastInvoiceDate.setDate(lastInvoiceDate.getDate() - Math.floor(Math.random() * 30) - 1);
                    lastDate = lastInvoiceDate.toISOString();
                }

                return {
                    id: `REC-${(i + 1).toString().padStart(3, '0')}`,
                    name: `${randomFrequency.charAt(0).toUpperCase() + randomFrequency.slice(1)} Service Plan`,
                    client: randomClient,
                    amount: Math.floor(Math.random() * 2000) + 500,
                    frequency: randomFrequency,
                    nextDate: nextDate.toISOString(),
                    lastDate,
                    status: randomStatus,
                    createdInvoices: Math.floor(Math.random() * 10)
                };
            });

            setInvoices(mockInvoices);
            setLoading(false);
        }, 800);
    }, []);

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.client.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getFrequencyDisplay = (frequency: string) => {
        switch (frequency) {
            case 'weekly':
                return 'Every week';
            case 'monthly':
                return 'Every month';
            case 'quarterly':
                return 'Every 3 months';
            case 'yearly':
                return 'Every year';
            default:
                return frequency;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <div className="flex items-center gap-1 badge-success text-xs font-semibold">
                        <CheckCircle size={14} />
                        <span>Active</span>
                    </div>
                );
            case 'paused':
                return (
                    <div className="flex items-center gap-1 badge-warning text-xs font-semibold">
                        <Clock size={14} />
                        <span>Paused</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1 badge-neutral text-xs font-semibold">
                        <XCircle size={14} />
                        <span>Completed</span>
                    </div>
                );
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <RefreshCw size={24} className="text-primary-600 mr-3" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">Recurring Invoices</h1>
                </div>
                <Link to="/invoices/recurring/create" className="btn-primary flex items-center gap-2 font-semibold">
                    <PlusCircle size={18} />
                    Create Recurring Invoice
                </Link>
            </div>

            {/* Info Card */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="text-primary-600 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary-800 text-base mb-1">Recurring Invoices</h3>
                        <p className="text-primary-700 text-sm">
                            Set up recurring invoices to automatically create and send invoices on a regular schedule.
                            Configure the frequency, start date, and billing details to streamline your invoicing process.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                            <input
                                type="text"
                                className="form-input pl-10 text-sm"
                                placeholder="Search recurring invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            className="form-input text-sm"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Client</th>
                                <th className="py-3 px-4 text-right text-sm font-semibold">Amount</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Frequency</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Next Date</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                                    <td className="py-3 px-4">
                                        <Link
                                            to={`/invoices/recurring/${invoice.id}`}
                                            className="text-primary-600 hover:underline font-semibold"
                                        >
                                            {invoice.name}
                                        </Link>
                                        <div className="text-xs text-neutral-500 mt-0.5 font-normal">
                                            {invoice.createdInvoices} invoices created
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{invoice.client.company}</div>
                                        <div className="text-xs text-neutral-500">{invoice.client.name}</div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-semibold">
                                        ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center text-xs font-medium">
                                            <RefreshCw size={16} className="mr-1.5 text-neutral-500" />
                                            {getFrequencyDisplay(invoice.frequency)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center text-xs font-medium">
                                            <Calendar size={16} className="mr-1.5 text-neutral-500" />
                                            {new Date(invoice.nextDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(invoice.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/invoices/recurring/${invoice.id}`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="View Schedule"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/invoices/recurring/${invoice.id}/edit`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="Edit Schedule"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="Create Invoice Now"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                className="p-1 text-neutral-500 hover:text-danger-600 hover:bg-neutral-100 rounded"
                                                title="Delete Schedule"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-neutral-500 text-base">
                                        No recurring invoices found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
                {filteredInvoices.length === 0 && (
                    <div className="text-center text-neutral-500 py-8 text-base">
                        No recurring invoices found matching your criteria
                    </div>
                )}
                {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-primary-700 text-base">
                                <Link to={`/invoices/recurring/${invoice.id}`}>{invoice.name}</Link>
                            </div>
                            <div>{getStatusBadge(invoice.status)}</div>
                        </div>
                        <div className="text-sm text-neutral-700 font-medium">{invoice.client.company}</div>
                        <div className="text-xs text-neutral-500">{invoice.client.name}</div>
                        <div className="flex justify-between text-xs mt-2">
                            <span className="flex items-center">
                                <RefreshCw size={14} className="mr-1 text-neutral-500" />
                                {getFrequencyDisplay(invoice.frequency)}
                            </span>
                            <span className="flex items-center">
                                <Calendar size={14} className="mr-1 text-neutral-500" />
                                {new Date(invoice.nextDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-semibold text-lg text-green-700">
                                ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    to={`/invoices/recurring/${invoice.id}`}
                                    className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                    title="View"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link
                                    to={`/invoices/recurring/${invoice.id}/edit`}
                                    className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                    title="Create Invoice Now"
                                >
                                    <Copy size={18} />
                                </button>
                                <button
                                    className="p-1 text-neutral-500 hover:text-danger-600 hover:bg-neutral-100 rounded"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                            {invoice.createdInvoices} invoices created
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredInvoices.length === 0 && searchTerm === '' && statusFilter === 'all' && (
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                        <RefreshCw size={32} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Recurring Invoices Yet</h3>
                    <p className="text-neutral-600 mb-4">
                        You haven't set up any recurring invoices yet. Create your first one to automate your billing.
                    </p>
                    <Link to="/invoices/recurring/create" className="btn-primary flex items-center gap-2">
                        <PlusCircle size={18} />
                        Create Recurring Invoice
                    </Link>
                </div>
            )}
        </>
    );
};

export default RecurringInvoices;