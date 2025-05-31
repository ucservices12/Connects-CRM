import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Filter, Download, Eye, Calendar,
    CheckCircle, AlertTriangle, Clock, FileText
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InvoiceHistoryItem {
    id: string;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    date: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
    action: string;
    user: string;
}

const InvoiceHistory = () => {
    const [history, setHistory] = useState<InvoiceHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: '',
        end: ''
    });

    useEffect(() => {
        setTimeout(() => {
            const mockHistory: InvoiceHistoryItem[] = Array.from({ length: 20 }, (_, i) => {
                const statuses: Array<'draft' | 'sent' | 'paid' | 'overdue'> = ['draft', 'sent', 'paid', 'overdue'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const actions = ['Created', 'Updated', 'Sent', 'Viewed', 'Paid', 'Marked overdue'];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                const clients = [
                    'Acme Corporation',
                    'Globex Industries',
                    'Stark Enterprises',
                    'Wayne Industries',
                    'Umbrella Corp'
                ];
                const randomClient = clients[Math.floor(Math.random() * clients.length)];
                const users = [
                    'John Admin',
                    'Sarah HR',
                    'Tony Manager',
                    'System'
                ];
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 30));
                return {
                    id: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    invoiceNumber: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    clientName: randomClient,
                    amount: Math.floor(Math.random() * 5000) + 500,
                    date: date.toISOString(),
                    status: randomStatus,
                    action: randomAction,
                    user: randomUser
                };
            });
            setHistory(mockHistory);
            setLoading(false);
        }, 800);
    }, []);

    const filteredHistory = history.filter(item => {
        const matchesSearch =
            item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

        // Date filter
        let matchesDate = true;
        if (dateRange.start) {
            matchesDate = new Date(item.date) >= new Date(dateRange.start);
        }
        if (matchesDate && dateRange.end) {
            // Set end date to end of day
            const end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999);
            matchesDate = new Date(item.date) <= end;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleExportPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'A4'
        });

        doc.setFontSize(16);
        doc.text('Invoice History', 40, 40);

        autoTable(doc, {
            startY: 60,
            head: [[
                'Date & Time',
                'Invoice #',
                'Client',
                'Amount',
                'Status',
                'Action',
                'User'
            ]],
            body: filteredHistory.map(item => [
                new Date(item.date).toLocaleString(),
                item.invoiceNumber,
                item.clientName,
                `₹${item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                item.status.charAt(0).toUpperCase() + item.status.slice(1),
                item.action,
                item.user
            ]),
            styles: { fontSize: 10 },
            headStyles: { fillColor: [34, 197, 94] },
            margin: { left: 40, right: 40 }
        });

        doc.save('invoice-history.pdf');
    };


    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return (
                    <div className="flex items-center gap-1 badge-success">
                        <CheckCircle size={14} />
                        <span>Paid</span>
                    </div>
                );
            case 'sent':
                return (
                    <div className="flex items-center gap-1 badge-primary">
                        <Clock size={14} />
                        <span>Sent</span>
                    </div>
                );
            case 'overdue':
                return (
                    <div className="flex items-center gap-1 badge-danger">
                        <AlertTriangle size={14} />
                        <span>Overdue</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1 badge-neutral">
                        <FileText size={14} />
                        <span>Draft</span>
                    </div>
                );
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Invoice History</h1>
                <button className="btn-outline" onClick={handleExportPDF}>
                    <Download size={18} />
                    Export
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-40 relative">
                    <Filter size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                    <select
                        className="form-input pl-10 appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </div>
                {/* Date Range Filter */}
                <div className="flex sm:flex-row flex-col text-center gap-2 sm:items-center">
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                        <input
                            type="date"
                            className="form-input pl-10"
                            value={dateRange.start}
                            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                    </div>
                    <span className="text-neutral-500">to</span>
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                        <input
                            type="date"
                            className="form-input pl-10"
                            value={dateRange.end}
                            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-4 text-left">Date & Time</th>
                                <th className="py-3 px-4 text-left">Invoice #</th>
                                <th className="py-3 px-4 text-left">Client</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Action</th>
                                <th className="py-3 px-4 text-left">User</th>
                                <th className="py-3 px-4 text-center">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item, index) => (
                                <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                                    <td className="py-3 px-4">
                                        {new Date(item.date).toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link
                                            to={`/invoices/${item.id}`}
                                            className="text-primary-600 hover:underline"
                                        >
                                            {item.invoiceNumber}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.clientName}
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">
                                        ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4 flex items-center gap-2">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.action}
                                    </td>
                                    <td className="py-3 px-4">
                                        {item.user}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link
                                            to={`/invoices/${item.id}`}
                                            className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded inline-flex"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-neutral-500">
                                        No history found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4 p-2">
                {filteredHistory.length === 0 && (
                    <div className="text-center text-neutral-500 py-8">
                        No history found matching your criteria
                    </div>
                )}
                {filteredHistory.map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-primary-700">
                                <Link to={`/invoices/${item.id}`}>{item.invoiceNumber}</Link>
                            </div>
                            <div>{getStatusBadge(item.status)}</div>
                        </div>
                        <div className="text-sm text-neutral-700">{item.clientName}</div>
                        <div className="text-xs text-neutral-500">{item.user}</div>
                        <div className="flex justify-between text-xs mt-2">
                            <span>{new Date(item.date).toLocaleString()}</span>
                            <span className="font-medium text-green-700">
                                ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs">{item.action}</span>
                            <Link
                                to={`/invoices/${item.id}`}
                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                title="View"
                            >
                                <Eye size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default InvoiceHistory;