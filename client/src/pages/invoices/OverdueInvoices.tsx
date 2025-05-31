import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertTriangle, Eye, Send, Clock } from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';

interface OverdueInvoice {
    id: string;
    invoiceNumber: string;
    client: {
        id: string;
        name: string;
        company: string;
        email: string;
    };
    amount: number;
    dueDate: string;
    issuedDate: string;
    daysOverdue: number;
    lastReminder: string | null;
}

const OverdueInvoices = () => {
    const [invoices, setInvoices] = useState<OverdueInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

    useEffect(() => {
        setTimeout(() => {
            const mockInvoices: OverdueInvoice[] = Array.from({ length: 12 }, (_, i) => {
                const clients = [
                    { id: '1', name: 'John Smith', company: 'Acme Corporation', email: 'john@acme.com' },
                    { id: '2', name: 'Sarah Johnson', company: 'Globex Industries', email: 'sarah@globex.com' },
                    { id: '3', name: 'Tony Stark', company: 'Stark Enterprises', email: 'tony@stark.com' },
                    { id: '4', name: 'Bruce Wayne', company: 'Wayne Industries', email: 'bruce@wayne.com' },
                    { id: '5', name: 'Albert Wesker', company: 'Umbrella Corp', email: 'wesker@umbrella.com' }
                ];
                const randomClient = clients[Math.floor(Math.random() * clients.length)];

                const today = new Date();
                const dueDate = new Date(today);
                dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 30) - 1);

                const issuedDate = new Date(dueDate);
                issuedDate.setDate(issuedDate.getDate() - 30);

                const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

                let lastReminder = null;
                if (Math.random() > 0.3) {
                    const reminderDate = new Date(today);
                    reminderDate.setDate(reminderDate.getDate() - Math.floor(Math.random() * 7) - 1);
                    lastReminder = reminderDate.toISOString();
                }

                return {
                    id: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    invoiceNumber: `INV-2025-${(i + 1).toString().padStart(3, '0')}`,
                    client: randomClient,
                    amount: Math.floor(Math.random() * 5000) + 500,
                    dueDate: dueDate.toISOString(),
                    issuedDate: issuedDate.toISOString(),
                    daysOverdue,
                    lastReminder
                };
            });

            mockInvoices.sort((a, b) => b.daysOverdue - a.daysOverdue);

            setInvoices(mockInvoices);
            setLoading(false);
        }, 800);
    }, []);

    const filteredInvoices = invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleInvoiceSelection = (id: string) => {
        setSelectedInvoices(prev =>
            prev.includes(id)
                ? prev.filter(invId => invId !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedInvoices.length === filteredInvoices.length) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(filteredInvoices.map(inv => inv.id));
        }
    };

    const sendReminders = () => {
        if (selectedInvoices.length === 0) return;
        alert(`Sending reminders for ${selectedInvoices.length} invoices`);
        const now = new Date().toISOString();
        setInvoices(prev =>
            prev.map(inv =>
                selectedInvoices.includes(inv.id)
                    ? { ...inv, lastReminder: now }
                    : inv
            )
        );
        setSelectedInvoices([]);
    };

    if (loading) return <LoadingScreen />;

    // Helper for INR formatting
    const formatINR = (amount: number) =>
        `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <AlertTriangle size={24} className="text-danger-600 mr-3" />
                    <h1 className="text-2xl font-medium">Overdue Invoices</h1>
                    <span className="ml-3 badge-danger">{invoices.length} Overdue</span>
                </div>
                <button
                    className={`btn-primary ${selectedInvoices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={selectedInvoices.length === 0}
                    onClick={sendReminders}
                >
                    <Send size={18} />
                    Send Reminders ({selectedInvoices.length})
                </button>
            </div>

            {/* Alert */}
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-6 flex items-start">
                <div className="text-danger-600 mr-3 mt-0.5">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h3 className="font-medium text-danger-800">Attention Required</h3>
                    <p className="text-danger-700">
                        You have {invoices.length} overdue invoices totaling <span className="font-semibold">{formatINR(invoices.reduce((sum, inv) => sum + inv.amount, 0))}</span>.
                        Select invoices and use the "Send Reminders" button to notify clients.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
                    <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Search overdue invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                <th className="py-3 px-4 text-left">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                            checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                        <span>Invoice #</span>
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left">Client</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-left">Due Date</th>
                                <th className="py-3 px-4 text-center">Days Overdue</th>
                                <th className="py-3 px-4 text-left">Last Reminder</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                                checked={selectedInvoices.includes(invoice.id)}
                                                onChange={() => toggleInvoiceSelection(invoice.id)}
                                            />
                                            <Link
                                                to={`/invoices/${invoice.id}`}
                                                className="text-primary-600 hover:underline"
                                            >
                                                {invoice.invoiceNumber}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{invoice.client.company}</div>
                                        <div className="text-sm text-neutral-500">{invoice.client.email}</div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">
                                        {formatINR(invoice.amount)}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`badge-danger ${invoice.daysOverdue > 14 ? 'bg-danger-200' : ''}`}>
                                            {invoice.daysOverdue} days
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {invoice.lastReminder ? (
                                            <div className="flex items-center text-neutral-600">
                                                <Clock size={16} className="mr-1" />
                                                {new Date(invoice.lastReminder).toLocaleDateString('en-IN')}
                                            </div>
                                        ) : (
                                            <span className="text-neutral-500">No reminders sent</span>
                                        )}
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
                                                to={`/invoices/${invoice.id}/send`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="Send Reminder"
                                            >
                                                <Send size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                                        No overdue invoices found matching your criteria
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
                    <div className="text-center text-neutral-500 py-8">
                        No overdue invoices found matching your criteria
                    </div>
                )}
                {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="rounded-lg border border-danger-200 bg-danger-50 p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-danger-700 text-base flex items-center gap-2">
                                <AlertTriangle size={16} />
                                <Link to={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                            </div>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                checked={selectedInvoices.includes(invoice.id)}
                                onChange={() => toggleInvoiceSelection(invoice.id)}
                            />
                        </div>
                        <div className="text-sm text-neutral-700 font-medium">{invoice.client.company}</div>
                        <div className="text-xs text-neutral-500">{invoice.client.email}</div>
                        <div className="flex justify-between text-xs mt-2">
                            <span>Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}</span>
                            <span className="font-medium text-danger-700">{invoice.daysOverdue} days overdue</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-semibold text-lg text-green-700">
                                {formatINR(invoice.amount)}
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
                                    to={`/invoices/${invoice.id}/send`}
                                    className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                    title="Send Reminder"
                                >
                                    <Send size={18} />
                                </Link>
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                            {invoice.lastReminder ? (
                                <span className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    Last reminder: {new Date(invoice.lastReminder).toLocaleDateString('en-IN')}
                                </span>
                            ) : (
                                <span>No reminders sent</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default OverdueInvoices;