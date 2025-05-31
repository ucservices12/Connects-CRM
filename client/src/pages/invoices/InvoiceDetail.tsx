import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Edit, Printer, Download, Send, CreditCard,
    CheckCircle, AlertTriangle, FileText
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Print-only CSS for A4 size and hiding non-print elements
const printStyles = `
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }
  html, body {
    width: 210mm;
    height: 297mm;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }
  body * {
    visibility: hidden !important;
  }
  #print-invoice, #print-invoice * {
    visibility: visible !important;
  }
  #print-invoice {
    position: absolute !important;
    left: 0; top: 0; width: 210mm; min-height: 297mm; background: white !important; z-index: 9999;
    box-shadow: none !important;
    padding: 35px !important;
    margin: 0 !important;
    font-size: 13px !important;
  }
  .no-print, .no-print * {
    display: none !important;
  }
}
`;

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface Invoice {
    id: string;
    client: {
        id: string;
        name: string;
        company: string;
        email: string;
        address: string;
    };
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    notes: string;
    tax: number;
    discount: number;
    subtotal: number;
    taxAmount: number;
    total: number;
    grandTotal: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const InvoiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inject print styles
        const style = document.createElement('style');
        style.innerHTML = printStyles;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            const mockInvoice: Invoice = {
                id: id || 'INV-2025-001',
                client: {
                    id: '1',
                    name: 'John Smith',
                    company: 'Acme Corporation',
                    email: 'john@acme.com',
                    address: '123 Business Ave, Suite 100, San Francisco, CA 94107'
                },
                invoiceNumber: id || 'INV-2025-001',
                issueDate: '2025-03-15',
                dueDate: '2025-04-14',
                items: [
                    {
                        id: '1',
                        description: 'Website Development',
                        quantity: 1,
                        rate: 2000,
                        amount: 2000
                    },
                    {
                        id: '2',
                        description: 'SEO Services',
                        quantity: 5,
                        rate: 100,
                        amount: 500
                    }
                ],
                notes: 'Payment is due within 30 days. Please make checks payable to Your Company Name or you can use the online payment link.',
                tax: 10,
                discount: 5,
                subtotal: 2500,
                taxAmount: 250,
                total: 2750,
                grandTotal: 2625,
                status: 'sent'
            };

            setInvoice(mockInvoice);
            setLoading(false);
        }, 800);
    }, [id]);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;
        const element = invoiceRef.current;

        // Set width to A4 for html2canvas
        const originalWidth = element.style.width;
        element.style.width = '210mm';

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fff",
            windowWidth: 794 // 210mm in px at 96dpi
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
        const pageWidth = 210;
        const pageHeight = 297;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pageWidth;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let position = 0;

        if (pdfHeight < pageHeight) {
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        } else {
            // If content is longer than one page
            let heightLeft = pdfHeight;
            let y = 0;
            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
                y -= pageHeight;
                if (heightLeft > 0) pdf.addPage();
            }
        }
        pdf.save(`Invoice-${invoice?.invoiceNumber}.pdf`);
        element.style.width = originalWidth;
    };

    // Print handler to set custom title
    const handlePrint = () => {
        const oldTitle = document.title;
        document.title = `Invoice-${invoice?.invoiceNumber}`;
        window.print();
        setTimeout(() => {
            document.title = oldTitle;
        }, 1000);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (!invoice) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-medium mb-4">Invoice not found</h1>
                <p>The requested invoice could not be found.</p>
                <Link to="/invoices/list" className="text-primary-600 hover:underline mt-4 inline-block">
                    Return to invoice list
                </Link>
            </div>
        );
    }

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
                        <Send size={14} />
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

    // Format currency in INR
    const formatRupees = (amount: number) =>
        `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 no-print">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-neutral-100"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">Invoice {invoice.invoiceNumber}</h1>
                    <div className="ml-4">{getStatusBadge(invoice.status)}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button className="btn-outline" onClick={handlePrint}>
                        <Printer size={18} />
                        Print
                    </button>
                    <button className="btn-outline" onClick={handleDownloadPDF}>
                        <Download size={18} />
                        Download
                    </button>
                    {invoice.status === 'draft' && (
                        <button className="btn-primary">
                            <Send size={18} />
                            Send
                        </button>
                    )}
                    {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                        <button className="btn-success">
                            <CreditCard size={18} />
                            Record Payment
                        </button>
                    )}
                    <button
                        className="btn-outline"
                        onClick={() => navigate(`/invoices/${id}/edit`)}
                    >
                        <Edit size={18} />
                        Edit
                    </button>
                </div>
            </div>

            {/* Only this section will print */}
            <div
                ref={invoiceRef}
                id="print-invoice"
                className="card p-4 sm:p-8 mx-auto"
                style={{ maxWidth: '210mm', minHeight: '297mm', width: '100%' }}
            >
                {/* Header: Company & Invoice Meta */}
                <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-1">Your Company Name</h2>
                        <p className="text-neutral-600">123 Company St</p>
                        <p className="text-neutral-600">San Francisco, CA 94103</p>
                        <p className="text-neutral-600">billing@yourcompany.com</p>
                    </div>
                    <div className="md:text-right flex flex-col items-end min-w-[160px]">
                        <div className="text-lg font-medium mb-1">Invoice #{invoice.invoiceNumber}</div>
                        <div className="flex justify-end w-full mb-1">
                            <span className="inline-block">{getStatusBadge(invoice.status)}</span>
                        </div>
                        <div className="text-neutral-600 text-sm">Issue: {new Date(invoice.issueDate).toLocaleDateString('en-IN')}</div>
                        <div className="text-neutral-600 text-sm">Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}</div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-sm uppercase text-neutral-500 mb-2">Bill To:</h3>
                        <div className="font-medium">{invoice.client.company}</div>
                        <div>{invoice.client.name}</div>
                        <div className="text-neutral-600">{invoice.client.address}</div>
                        <div className="text-neutral-600">{invoice.client.email}</div>
                    </div>
                    <div className="md:text-right"></div>
                </div>

                {/* Invoice Items */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="text-left py-3 pl-2 pr-4">Description</th>
                                <th className="text-right py-3 px-4 whitespace-nowrap">Quantity</th>
                                <th className="text-right py-3 px-4 whitespace-nowrap">Rate</th>
                                <th className="text-right py-3 px-4 whitespace-nowrap">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="border-b border-neutral-200">
                                    <td className="py-4 pl-2 pr-4">{item.description}</td>
                                    <td className="py-4 px-4 text-right">{item.quantity}</td>
                                    <td className="py-4 px-4 text-right">
                                        {formatRupees(item.rate)}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {formatRupees(item.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex flex-col items-end">
                    <div className="w-full md:w-64">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>{formatRupees(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Tax ({invoice.tax}%):</span>
                            <span>{formatRupees(invoice.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Discount ({invoice.discount}%):</span>
                            <span>-{formatRupees((invoice.subtotal * invoice.discount) / 100)}</span>
                        </div>
                        <div className="flex justify-between py-3 font-medium text-lg border-t border-neutral-200 mt-2">
                            <span>Grand Total:</span>
                            <span>{formatRupees(invoice.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                    <div className="mt-8 pt-6 border-t border-neutral-200">
                        <h3 className="text-sm uppercase text-neutral-500 mb-2">Notes:</h3>
                        <p className="text-neutral-600">{invoice.notes}</p>
                    </div>
                )}

                {/* Payment Info */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                    <h3 className="text-sm uppercase text-neutral-500 mb-2">Payment Information:</h3>
                    <p className="text-neutral-600">
                        Please include the invoice number {invoice.invoiceNumber} with your payment.
                    </p>
                    <p className="text-neutral-600 mt-2">
                        Bank Transfer: Bank Name • Account #: 123456789 • IFSC: SBIN0000001
                    </p>
                </div>

                {/* Thank You */}
                <div className="flex flex-col min-h-[60px] justify-end mt-10 text-center text-neutral-600">
                    Thank you for your business!
                </div>
            </div>
        </>
    );
};

export default InvoiceDetail;