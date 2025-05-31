import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Filter, PlusCircle, Download, Eye, Edit,
    Trash2, CheckCircle, AlertTriangle, Clock, FileText,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';

interface Invoice {
    id: string;
    client: {
        id: string;
        name: string;
        company: string;
    };
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const InvoiceList = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setTimeout(() => {
            const mockInvoices: Invoice[] = Array.from({ length: 35 }, (_, i) => {
                const statuses: Array<'draft' | 'sent' | 'paid' | 'overdue'> = ['draft', 'sent', 'paid', 'overdue'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const clients = [
                    { id: '1', name: 'John Smith', company: 'Acme Corporation' },
                    { id: '2', name: 'Sarah Johnson', company: 'Globex Industries' },
                    { id: '3', name: 'Tony Stark', company: 'Stark Enterprises' },
                    { id: '4', name: 'Bruce Wayne', company: 'Wayne Industries' },
                    { id: '5', name: 'Albert Wesker', company: 'Umbrella Corp' }
                ];
                const randomClient = clients[Math.floor(Math.random() * clients.length)];

                const issueDate = new Date();
                issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 60));

                const dueDate = new Date(issueDate);
                dueDate.setDate(dueDate.getDate() + 30);

                return {
                    id: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    client: randomClient,
                    invoiceNumber: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    issueDate: issueDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                    amount: Math.floor(Math.random() * 5000) + 500,
                    status: randomStatus
                };
            });

            setInvoices(mockInvoices);
            setLoading(false);
        }, 800);
    }, []);

    // Filter invoices based on search term and status filter
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.client.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Get badge class based on status
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

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium">Invoices</h1>
                <Link to="/invoices/create" className="btn-primary">
                    <PlusCircle size={18} />
                    Create Invoice
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                            <input
                                type="text"
                                className="form-input pl-10"
                                placeholder="Search by invoice number or client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-40">
                            <div className="relative">
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
                        </div>

                        <button className="btn-outline">
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Invoice List */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-4 text-left">Invoice #</th>
                                <th className="py-3 px-4 text-left">Client</th>
                                <th className="py-3 px-4 text-left">Issue Date</th>
                                <th className="py-3 px-4 text-left">Due Date</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                                    <td className="py-3 px-4">
                                        <Link
                                            to={`/invoices/${invoice.id}`}
                                            className="text-primary-600 hover:underline"
                                        >
                                            {invoice.invoiceNumber}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{invoice.client.company}</div>
                                        <div className="text-sm text-neutral-500">{invoice.client.name}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(invoice.issueDate).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">
                                        ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(invoice.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/invoices/${invoice.id}`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/invoices/${invoice.id}/edit`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                className="p-1 text-neutral-500 hover:text-danger-600 hover:bg-neutral-100 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                                        No invoices found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {paginatedInvoices.length === 0 && (
                        <div className="text-center text-neutral-500 py-8">
                            No invoices found matching your criteria
                        </div>
                    )}
                    {paginatedInvoices.map((invoice) => (
                        <div key={invoice.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-primary-700">
                                    <Link to={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                                </div>
                                <div>{getStatusBadge(invoice.status)}</div>
                            </div>
                            <div className="text-sm text-neutral-700">{invoice.client.company}</div>
                            <div className="text-xs text-neutral-500">{invoice.client.name}</div>
                            <div className="flex justify-between text-xs mt-2">
                                <span>Issue: {new Date(invoice.issueDate).toLocaleDateString('en-IN')}</span>
                                <span>Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-medium text-lg text-green-700">
                                    ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/invoices/${invoice.id}`}
                                        className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/invoices/${invoice.id}/edit`}
                                        className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        className="p-1 text-neutral-500 hover:text-danger-600 hover:bg-neutral-100 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {filteredInvoices.length > 0 && (
                    <div className="py-4 px-6 flex flex-col md:flex-row justify-between items-center border-t border-neutral-200 gap-2">
                        <div className="text-sm text-neutral-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="p-2 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                )
                                .map((page, index, array) => {
                                    // Add ellipsis
                                    if (index > 0 && array[index - 1] !== page - 1) {
                                        return (
                                            <React.Fragment key={`ellipsis-${page}`}>
                                                <span className="p-2">...</span>
                                                <button
                                                    className={`w-10 h-10 rounded ${currentPage === page
                                                        ? 'bg-primary-600 text-white'
                                                        : 'hover:bg-neutral-100'
                                                        }`}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    }

                                    return (
                                        <button
                                            key={page}
                                            className={`w-10 h-10 rounded ${currentPage === page
                                                ? 'bg-primary-600 text-white'
                                                : 'hover:bg-neutral-100'
                                                }`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                            <button
                                className="p-2 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default InvoiceList;