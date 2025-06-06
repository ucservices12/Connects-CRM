import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Search, ArrowLeft, UserCircle, Mail, Phone, Calendar,
    PlusCircle, Filter, Eye, Edit, Send, CheckCircle,
    AlertTriangle, Clock, FileText
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';

interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    since: string;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const ClientInvoices = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState<Client | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            // This would be an API call in a real application
            const mockClient: Client = {
                id: clientId || '1',
                name: 'John Smith',
                company: 'Acme Corporation',
                email: 'john@acme.com',
                phone: '(555) 123-4567',
                address: '123 Business Ave, Suite 100, San Francisco, CA 94107',
                since: '2023-01-15'
            };

            const mockInvoices: Invoice[] = Array.from({ length: 15 }, (_, i) => {
                const statuses: Array<'draft' | 'sent' | 'paid' | 'overdue'> = ['draft', 'sent', 'paid', 'overdue'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                const issueDate = new Date();
                issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 180)); // Last 6 months

                const dueDate = new Date(issueDate);
                dueDate.setDate(dueDate.getDate() + 30);

                return {
                    id: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    invoiceNumber: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    issueDate: issueDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                    amount: Math.floor(Math.random() * 5000) + 500,
                    status: randomStatus
                };
            });

            // Sort by issue date (newest first)
            mockInvoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

            setClient(mockClient);
            setInvoices(mockInvoices);
            setLoading(false);
        }, 800);
    }, [clientId]);

    // Filter invoices based on search term and status filter
    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Calculate metrics
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const totalPending = invoices
        .filter(inv => inv.status === 'sent')
        .reduce((sum, inv) => sum + inv.amount, 0);
    const totalOverdue = invoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);

    // Get status badge
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

    if (loading || !client) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-neutral-100"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">Invoices for {client.company}</h1>
                </div>

                <Link to={`/invoices/create?client=${clientId}`} className="btn-primary">
                    <PlusCircle size={18} />
                    Create Invoice
                </Link>
            </div>

            {/* Client Card */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                            <UserCircle size={32} />
                        </div>

                        <div>
                            <h2 className="text-xl font-medium">{client?.company}</h2>
                            <p className="text-neutral-600">{client?.name}</p>

                            <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2">
                                <div className="flex items-center text-neutral-600">
                                    <Mail size={16} className="mr-1" />
                                    <span>{client?.email}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Phone size={16} className="mr-1" />
                                    <span>{client?.phone}</span>
                                </div>
                                <div className="flex items-center text-neutral-600">
                                    <Calendar size={16} className="mr-1" />
                                    <span>Client since {new Date(client?.since).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link to={`/clients/${clientId}`} className="btn-outline">
                            View Client
                        </Link>
                        <Link to={`/clients/${clientId}/edit`} className="btn-outline">
                            <Edit size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-card p-6">
                    <p className="text-neutral-500 text-sm mb-1">Total Invoiced</p>
                    <h3 className="text-2xl font-medium">${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-neutral-600 mt-2">{invoices.length} invoices total</p>
                </div>

                <div className="bg-white rounded-lg shadow-card p-6">
                    <p className="text-neutral-500 text-sm mb-1">Total Paid</p>
                    <h3 className="text-2xl font-medium text-success-600">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-neutral-600 mt-2">{invoices.filter(inv => inv.status === 'paid').length} paid invoices</p>
                </div>

                <div className="bg-white rounded-lg shadow-card p-6">
                    <p className="text-neutral-500 text-sm mb-1">Pending Payment</p>
                    <h3 className="text-2xl font-medium text-primary-600">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-neutral-600 mt-2">{invoices.filter(inv => inv.status === 'sent').length} pending invoices</p>
                </div>

                <div className="bg-white rounded-lg shadow-card p-6">
                    <p className="text-neutral-500 text-sm mb-1">Overdue</p>
                    <h3 className="text-2xl font-medium text-danger-600">${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-sm text-neutral-600 mt-2">{invoices.filter(inv => inv.status === 'overdue').length} overdue invoices</p>
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
                                className="form-input pl-10"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-48">
                        <div className="relative">
                            <Filter size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                            <select
                                className="form-input pl-10 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pendding">Pending Payment</option>
                                <option value="Processing">Processing</option>
                                <option value="Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Refunded">Refunded</option>
                                <option value="Failed">Failed</option>
                                <option value="Draft">Draft</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-4 text-left">Invoice #</th>
                                <th className="py-3 px-4 text-left">Issue Date</th>
                                <th className="py-3 px-4 text-left">Due Date</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
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
                                        {new Date(invoice.issueDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">
                                        ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4">
                                        {getStatusBadge(invoice.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/invoices/${invoice.id}`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="View Invoice"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/invoices/${invoice.id}/edit`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="Edit Invoice"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            {(invoice.status === 'draft' || invoice.status === 'overdue') && (
                                                <Link
                                                    to={`/invoices/${invoice.id}/send`}
                                                    className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                    title="Send Invoice"
                                                >
                                                    <Send size={18} />
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                                        No invoices found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredInvoices.length === 0 && searchTerm === '' && statusFilter === 'all' && (
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Invoices Yet</h3>
                        <p className="text-neutral-600 mb-4">
                            This client doesn't have any invoices yet. Create your first invoice to get started.
                        </p>
                        <Link to={`/invoices/create?client=${clientId}`} className="btn-primary">
                            <PlusCircle size={18} />
                            Create First Invoice
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default ClientInvoices;