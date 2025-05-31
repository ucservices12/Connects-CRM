import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Edit, Copy, Trash2, Clock, CheckCircle,
    XCircle, Calendar, Building2, DollarSign, RefreshCw,
    AlertTriangle
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';

interface RecurringInvoice {
    id: string;
    name: string;
    client: {
        id: string;
        name: string;
        company: string;
        email: string;
    };
    amount: number;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextDate: string;
    lastDate: string | null;
    status: 'active' | 'paused' | 'completed';
    createdInvoices: number;
    items: Array<{
        id: string;
        description: string;
        quantity: number;
        rate: number;
        amount: number;
    }>;
    notes: string;
    tax: number;
}

const RecurringInvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<RecurringInvoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            const mockInvoice: RecurringInvoice = {
                id: id || 'REC-001',
                name: 'Monthly Service Plan',
                client: {
                    id: '1',
                    name: 'John Smith',
                    company: 'Acme Corporation',
                    email: 'john@acme.com'
                },
                amount: 2500,
                frequency: 'monthly',
                nextDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
                lastDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
                status: 'active',
                createdInvoices: 6,
                items: [
                    {
                        id: '1',
                        description: 'Website Maintenance',
                        quantity: 1,
                        rate: 1500,
                        amount: 1500
                    },
                    {
                        id: '2',
                        description: 'SEO Services',
                        quantity: 10,
                        rate: 100,
                        amount: 1000
                    }
                ],
                notes: 'Monthly recurring services as per contract dated Jan 1, 2025',
                tax: 10
            };

            setInvoice(mockInvoice);
            setLoading(false);
        }, 800);
    }, [id]);

    const handleDelete = () => {
        // Here you would normally send a delete request to your API
        console.log('Deleting recurring invoice:', id);
        setShowDeleteModal(false);
        navigate('/invoices/recurring');
    };

    const handleCopy = () => {
        // Here you would normally create a copy via API
        navigate('/invoices/recurring/create', {
            state: { copyFrom: invoice }
        });
    };

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
                    <div className="flex items-center gap-1 badge-success">
                        <CheckCircle size={14} />
                        <span>Active</span>
                    </div>
                );
            case 'paused':
                return (
                    <div className="flex items-center gap-1 badge-warning">
                        <Clock size={14} />
                        <span>Paused</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-1 badge-neutral">
                        <XCircle size={14} />
                        <span>Completed</span>
                    </div>
                );
        }
    };

    if (loading || !invoice) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-neutral-100"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">{invoice.name}</h1>
                    <div className="ml-4">
                        {getStatusBadge(invoice.status)}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        className="btn-outline"
                        onClick={handleCopy}
                    >
                        <Copy size={18} />
                        Copy
                    </button>
                    <Link
                        to={`/invoices/recurring/${id}/edit`}
                        className="btn-outline"
                    >
                        <Edit size={18} />
                        Edit
                    </Link>
                    <button
                        className="btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Main Content */}
                    <div className="bg-white rounded-lg shadow-card p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="text-sm uppercase text-neutral-500 mb-2">Client Information</h3>
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{invoice.client.company}</h4>
                                        <p className="text-neutral-600">{invoice.client.name}</p>
                                        <p className="text-neutral-600">{invoice.client.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm uppercase text-neutral-500 mb-2">Schedule Details</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <RefreshCw size={18} className="text-neutral-500 mr-2" />
                                        <span>{getFrequencyDisplay(invoice.frequency)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={18} className="text-neutral-500 mr-2" />
                                        <span>Next: {new Date(invoice.nextDate).toLocaleDateString()}</span>
                                    </div>
                                    {invoice.lastDate && (
                                        <div className="flex items-center">
                                            <Clock size={18} className="text-neutral-500 mr-2" />
                                            <span>Last: {new Date(invoice.lastDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Items */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-200">
                                            <th className="text-left py-3 pl-2 pr-4">Description</th>
                                            <th className="text-right py-3 px-4">Quantity</th>
                                            <th className="text-right py-3 px-4">Rate</th>
                                            <th className="text-right py-3 px-4">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item) => (
                                            <tr key={item.id} className="border-b border-neutral-200">
                                                <td className="py-3 pl-2 pr-4">{item.description}</td>
                                                <td className="py-3 px-4 text-right">{item.quantity}</td>
                                                <td className="py-3 px-4 text-right">${item.rate.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-right">${item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3">Notes</h3>
                                <p className="text-neutral-600">{invoice.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Generated Invoices */}
                    <div className="bg-white rounded-lg shadow-card p-6">
                        <h3 className="text-lg font-medium mb-4">Generated Invoices</h3>
                        <p className="text-neutral-600 mb-4">
                            This recurring invoice has generated {invoice.createdInvoices} invoices so far.
                        </p>
                        <Link
                            to={`/invoices/list?recurring=${id}`}
                            className="btn-outline"
                        >
                            View Generated Invoices
                        </Link>
                    </div>
                </div>

                <div>
                    {/* Summary Card */}
                    <div className="bg-white rounded-lg shadow-card p-6">
                        <h3 className="text-lg font-medium mb-4">Summary</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="text-neutral-500 text-sm">Amount</span>
                                <p className="text-2xl font-medium">
                                    ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Frequency</span>
                                <p className="font-medium">{getFrequencyDisplay(invoice.frequency)}</p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Next Invoice</span>
                                <p className="font-medium">{new Date(invoice.nextDate).toLocaleDateString()}</p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Status</span>
                                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                            </div>

                            <div className="pt-4 border-t border-neutral-200">
                                <span className="text-neutral-500 text-sm">Total Generated</span>
                                <p className="font-medium">{invoice.createdInvoices} invoices</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button className="btn-primary w-full">
                                <RefreshCw size={18} />
                                Generate Invoice Now
                            </button>

                            {invoice.status === 'active' ? (
                                <button className="btn-warning w-full">
                                    <Clock size={18} />
                                    Pause Schedule
                                </button>
                            ) : invoice.status === 'paused' ? (
                                <button className="btn-success w-full">
                                    <CheckCircle size={18} />
                                    Resume Schedule
                                </button>
                            ) : null}
                        </div>
                    </div>

                    {/* Warning Card */}
                    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mt-6">
                        <div className="flex">
                            <div className="text-danger-600 mr-3">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-danger-800">Important Note</h4>
                                <p className="text-sm text-danger-700">
                                    Deleting this recurring invoice will not affect previously generated invoices,
                                    but will prevent new invoices from being created.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium mb-4">Delete Recurring Invoice</h3>
                        <p className="text-neutral-600 mb-6">
                            Are you sure you want to delete this recurring invoice? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="btn-outline"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecurringInvoiceDetail;