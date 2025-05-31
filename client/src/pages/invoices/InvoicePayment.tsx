import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, Check, Calendar, FileText, X } from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';

interface Invoice {
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
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const InvoicePayment = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState<Invoice | null>(null);

    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [transactionId, setTransactionId] = useState('');
    const [notes, setNotes] = useState('');
    const [sendReceipt, setSendReceipt] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            // This would be an API call in a real application
            const mockInvoice: Invoice = {
                id: id || 'INV-2025-001',
                invoiceNumber: id || 'INV-2025-001',
                client: {
                    id: '1',
                    name: 'John Smith',
                    company: 'Acme Corporation',
                    email: 'john@acme.com'
                },
                amount: 2750,
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
                status: 'sent'
            };

            setInvoice(mockInvoice);
            setPaymentAmount(mockInvoice.amount.toString());
            setLoading(false);
        }, 800);
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Here you would normally send the payment data to your backend
        console.log({
            invoiceId: id,
            amount: parseFloat(paymentAmount),
            date: paymentDate,
            method: paymentMethod,
            transactionId,
            notes,
            sendReceipt
        });

        // Show success message
        alert('Payment recorded successfully!');

        // Navigate back to invoice detail
        navigate(`/invoices/${id}`);
    };

    if (loading || !invoice) {
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
                    <h1 className="text-2xl font-medium">Record Payment for Invoice {invoice.invoiceNumber}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-card p-6">
                        <form onSubmit={handleSubmit}>
                            {/* Payment Amount */}
                            <div className="form-group">
                                <label className="form-label">Payment Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={invoice.amount}
                                        className="form-input pl-8"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mt-1 flex justify-between text-sm">
                                    <span>Invoice Total: ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <button
                                        type="button"
                                        className="text-primary-600 hover:underline"
                                        onClick={() => setPaymentAmount(invoice.amount.toString())}
                                    >
                                        Pay Full Amount
                                    </button>
                                </div>
                            </div>

                            {/* Payment Date */}
                            <div className="form-group">
                                <label className="form-label">Payment Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-2.5 text-neutral-500" />
                                    <input
                                        type="date"
                                        className="form-input pl-10"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div
                                        className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${paymentMethod === 'bank_transfer'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-neutral-200 hover:bg-neutral-50'
                                            }`}
                                        onClick={() => setPaymentMethod('bank_transfer')}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${paymentMethod === 'bank_transfer'
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                                <line x1="2" x2="22" y1="10" y2="10" />
                                            </svg>
                                        </div>
                                        <div className="font-medium text-center">Bank Transfer</div>
                                        {paymentMethod === 'bank_transfer' && (
                                            <div className="absolute top-2 right-2 text-primary-600">
                                                <Check size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${paymentMethod === 'credit_card'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-neutral-200 hover:bg-neutral-50'
                                            }`}
                                        onClick={() => setPaymentMethod('credit_card')}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${paymentMethod === 'credit_card'
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div className="font-medium text-center">Credit Card</div>
                                        {paymentMethod === 'credit_card' && (
                                            <div className="absolute top-2 right-2 text-primary-600">
                                                <Check size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${paymentMethod === 'cash'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-neutral-200 hover:bg-neutral-50'
                                            }`}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${paymentMethod === 'cash'
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            <DollarSign size={20} />
                                        </div>
                                        <div className="font-medium text-center">Cash</div>
                                        {paymentMethod === 'cash' && (
                                            <div className="absolute top-2 right-2 text-primary-600">
                                                <Check size={16} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Transaction ID */}
                            <div className="form-group">
                                <label className="form-label">Transaction ID (Optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter transaction ID or reference number"
                                />
                            </div>

                            {/* Notes */}
                            <div className="form-group">
                                <label className="form-label">Notes (Optional)</label>
                                <textarea
                                    className="form-input"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any relevant payment notes"
                                    rows={3}
                                ></textarea>
                            </div>

                            {/* Send Receipt */}
                            <div className="form-group">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="sendReceipt"
                                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                        checked={sendReceipt}
                                        onChange={(e) => setSendReceipt(e.target.checked)}
                                    />
                                    <label htmlFor="sendReceipt" className="ml-2 text-neutral-700">
                                        Send receipt to client ({invoice.client.email})
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button type="submit" className="btn-success w-full">
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-lg shadow-card p-6">
                        <h2 className="text-lg font-medium mb-4">Invoice Summary</h2>

                        <div className="space-y-3">
                            <div>
                                <span className="text-neutral-500 text-sm">Invoice Number:</span>
                                <p className="font-medium">{invoice.invoiceNumber}</p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Client:</span>
                                <p className="font-medium">{invoice.client.company}</p>
                                <p className="text-sm">{invoice.client.name}</p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Amount:</span>
                                <p className="font-medium">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Due Date:</span>
                                <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>

                            <div>
                                <span className="text-neutral-500 text-sm">Status:</span>
                                <p className="font-medium capitalize">{invoice.status}</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-neutral-200 pt-4">
                            <h3 className="text-sm font-medium mb-2">What happens next?</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex">
                                    <div className="mr-3 text-success-600">
                                        <Check size={18} />
                                    </div>
                                    <p>The invoice will be marked as paid</p>
                                </div>

                                {sendReceipt && (
                                    <div className="flex">
                                        <div className="mr-3 text-success-600">
                                            <FileText size={18} />
                                        </div>
                                        <p>A payment receipt will be sent to the client</p>
                                    </div>
                                )}

                                <div className="flex">
                                    <div className="mr-3 text-success-600">
                                        <Calendar size={18} />
                                    </div>
                                    <p>Payment will be recorded in your financial reports</p>
                                </div>
                            </div>

                            <div className="mt-6 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                <div className="flex">
                                    <div className="mr-3 text-neutral-600">
                                        <X size={18} />
                                    </div>
                                    <p className="text-sm text-neutral-700">
                                        Payments cannot be easily reversed. Please double-check all information before recording.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoicePayment;