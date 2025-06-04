import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Edit, Printer, Download, Send, CreditCard,
    CheckCircle, AlertTriangle, FileText
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const printStyles = `
@media print {
  @page { size: A4 portrait; margin: 0; }
  html, body { width: 210mm; height: 297mm; margin: 0 !important; padding: 35px !important; background: white !important; }
  body * { visibility: hidden !important; }
  #print-invoice, #print-invoice * { visibility: visible !important; }
  #print-invoice {
    position: absolute !important; left: 0; top: 0; width: 210mm !important; min-height: 297mm !important; max-height: 297mm !important; background: white !important; z-index: 9999;
    box-shadow: none !important; padding: 4mm !important; margin: 0 !important; font-size: 10px !important;
    overflow: hidden !important;
  }
  .no-print, .no-print * { display: none !important; }
  .page-break { break-before: page !important; page-break-before: always !important; }
}
`;

const formatRupees = (amount: number) =>
    `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const getStatusBadge = (status: string) => {
    const map = {
        paid: { icon: <CheckCircle size={14} />, label: 'Paid', cls: 'bg-green-100 text-green-700 px-2 py-1 rounded' },
        sent: { icon: <Send size={14} />, label: 'Sent', cls: 'bg-blue-100 text-blue-700 px-2 py-1 rounded' },
        overdue: { icon: <AlertTriangle size={14} />, label: 'Overdue', cls: 'bg-red-100 text-red-700 px-2 py-1 rounded' },
        draft: { icon: <FileText size={14} />, label: 'Draft', cls: 'bg-gray-100 text-gray-700 px-2 py-1 rounded' }
    };
    const { icon, label, cls } = (map as any)[status] || map.draft;
    return <div className={`flex items-center gap-1 text-sm font-semibold ${cls}`}>{icon}<span>{label}</span></div>;
};

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = printStyles;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setInvoice({
                id: id || 'INV-10012',
                client: {
                    name: 'Amol S. Mahor',
                    mobile: "9673170912",
                    email: "amolmahor50@gmail.com",
                    address: {
                        street: '102, Bhoir Apartment',
                        city: 'Pune',
                        state: 'Maharashtra',
                        zipCode: '411033',
                        country: 'India'
                    }
                },
                invoiceNumber: id || 'INV-10012',
                issueDate: '2021-03-26',
                dueDate: '2021-04-25',
                items: [
                    { id: '1', description: 'Services', details: 'Cost of various services.', quantity: 10, rate: 55 },
                    { id: '2', description: 'Consulting', details: 'Consultant for your business.', quantity: 15, rate: 75 },
                    { id: '3', description: 'Materials', details: 'Cost of materials and supplies to complete job.', quantity: 1, rate: 123.39 }
                ],
                notes: 'Thank you for your business!',
                terms: 'Please pay within 30 days using the link in your invoice email.',
                sGST: 9,
                cGST: 9,
                discount: 10, // percent
                deposit: 200, // paid amount
                status: 'sent',
                bank: {
                    receiverCompanyName: "UMBARKAR CONSULTANCY AND SERVICES PRIVATE LIMITED",
                    name: "IDFC FIRST",
                    account: "10092498832",
                    ifsc: "IDFB0041373",
                    branch: "UNDRI BRANCH",
                    upi: "9404554801@okbizaxis"
                }
            });
            setLoading(false);
        }, 800);
    }, [id]);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;
        const element = invoiceRef.current;
        const originalWidth = element.style.width;
        const originalHeight = element.style.height;
        element.style.width = '210mm';
        element.style.minHeight = '297mm';
        element.style.maxHeight = '297mm';
        element.style.height = '297mm';
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#fff", windowWidth: 794 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        pdf.save(`Invoice-${invoice?.invoiceNumber}.pdf`);
        element.style.width = originalWidth;
        element.style.minHeight = '';
        element.style.maxHeight = '';
        element.style.height = originalHeight;
    };

    const handlePrint = () => {
        const oldTitle = document.title;
        document.title = `Invoice-${invoice?.invoiceNumber}`;
        window.print();
        setTimeout(() => { document.title = oldTitle; }, 1000);
    };

    if (loading) return <LoadingScreen />;
    if (!invoice) return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Invoice not found</h1>
            <p>The requested invoice could not be found.</p>
            <Link to="/invoices/list" className="text-blue-600 hover:underline mt-4 inline-block">
                Return to invoice list
            </Link>
        </div>
    );

    // Dynamic calculations
    const subtotal = invoice.items.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0);
    const sgstAmount = (subtotal * (invoice.sGST || 0)) / 100;
    const cgstAmount = (subtotal * (invoice.cGST || 0)) / 100;
    const taxAmount = sgstAmount + cgstAmount;
    const discountAmount = (subtotal * (invoice.discount || 0)) / 100;
    const total = subtotal + taxAmount - discountAmount;
    const paid = invoice.deposit || 0;
    const balanceDue = total - paid;

    const formatAddress = (address: any) => {
        if (!address) return '';
        if (typeof address === 'string') return address;
        return [address.street, address.city, address.state, address.zipCode, address.country]
            .filter(Boolean).join(', ');
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen py-8">
            {/* Top Bar */}
            <div className="max-w-4xl mx-auto mb-6 px-2 no-print">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-blue-100">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
                        <div className="ml-4">{getStatusBadge(invoice.status)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button className="btn-outline" onClick={handlePrint}><Printer size={18} />Print</button>
                        <button className="btn-outline" onClick={handleDownloadPDF}><Download size={18} />Download</button>
                        <button className="btn-outline" onClick={() => navigate(`/invoices/${id}/edit`)}>
                            <Edit size={18} />Edit
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoice Card */}
            <div
                ref={invoiceRef}
                id="print-invoice"
                className="mx-auto relative sm:p-8 card w-full bg-white shadow-lg"
                style={{
                    maxWidth: '210mm',
                    minHeight: '297mm',
                    maxHeight: '297mm',
                    height: 'auto',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
                    <div>
                        <div className='w-32'>
                            <img src="/logo.png" alt="" />
                        </div>
                        <h2 className="text-3xl font-bold text-black mb-2">INVOICE</h2>
                    </div>
                    <div className="sm:text-right max-w-xs text-gray-700 text-sm">
                        <div className="font-bold text-black mb-1">UC SERVICES PVT LTD.</div>
                        <div className='text-xs'>
                            GST No:27AACCU7014P1ZX<br />
                            TAN No:PNEU09354C<br />
                            M/s. UC Services Pvt Ltd.<br />
                            Office. 02 &15, Saiplaza,<br />
                            Zero boys Chowk,<br />
                            Nehru Nagar, Pimpri Chinchwad Pune-411018.<br />
                            +91 7709222331, +91 9270033002
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                    <div className="max-w-60">
                        <div className="text-xs font-bold text-gray-700 mb-1">Billed To</div>
                        <div className="text-gray-900 text-xs break-words">{invoice.client.name}</div>
                        <div className="text-gray-700 text-xs whitespace-pre-line break-words">{invoice.client.email}</div>
                        <div className="text-gray-700 text-xs whitespace-pre-line break-words">{invoice.client.mobile}</div>
                        <div className="text-gray-700 text-xs whitespace-pre-line break-words">{formatAddress(invoice.client.address)}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:gap-16 gap-4 text-xs w-full sm:w-auto">
                        <div>
                            <div className="text-xs font-bold text-gray-700">Date Issued</div>
                            <div className="text-gray-900">
                                {new Date(invoice.issueDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </div>
                            <div className="text-xs font-bold text-gray-700 mt-2">Due Date</div>
                            <div className="text-gray-900">
                                {new Date(invoice.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-700">Invoice Number</div>
                            <div className="text-gray-900 break-words">{invoice.invoiceNumber}</div>
                            <div className="text-xs font-bold text-gray-700 mt-2">Amount Due</div>
                            <div className="text-lg font-bold text-md text-green-500">{formatRupees(total)}</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-indigo-600">
                                <th className="text-left py-2 text-xs font-bold text-indigo-700 uppercase">SR.</th>
                                <th className="text-left py-2 text-xs font-bold text-indigo-700 uppercase">Description</th>
                                <th className="text-right py-2 text-xs font-bold text-indigo-700 uppercase">Rate</th>
                                <th className="text-right py-2 text-xs font-bold text-indigo-700 uppercase">Qty</th>
                                <th className="text-right py-2 text-xs font-bold text-indigo-700 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item: any, idx: number) => (
                                <React.Fragment key={item.id}>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-1 text-xs text-gray-500">{idx + 1}</td>
                                        <td className="py-1 text-xs font-semibold">{item.description}</td>
                                        <td className="py-1 text-xs text-right">{formatRupees(item.rate)}</td>
                                        <td className="py-1 text-xs text-right">{item.quantity}</td>
                                        <td className="py-1 text-xs text-right">{formatRupees(item.quantity * item.rate)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex flex-col items-end mt-3">
                    <div className="w-full md:w-1/2 text-xs">
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">Subtotal</span>
                            <span className="font-semibold">{formatRupees(subtotal)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">SGST ({invoice.sGST}%)</span>
                            <span className="font-semibold">{formatRupees(sgstAmount)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">CGST ({invoice.cGST}%)</span>
                            <span className="font-semibold">{formatRupees(cgstAmount)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">GST Tax</span>
                            <span className="font-semibold">{formatRupees(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">Discount ({invoice.discount}%)</span>
                            <span className="font-semibold text-green-700">-{formatRupees(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t border-gray-200 mt-2 text-md">
                            <span>Total</span>
                            <span>{formatRupees(total)}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b-2 border-indigo-600 font-semibold">
                            <span>Paid</span>
                            <span>{formatRupees(paid)}</span>
                        </div>
                        <div className="flex justify-between pt-1 font-bold text-indigo-700 text-md">
                            <span>Balance Due</span>
                            <span>{formatRupees(balanceDue)}</span>
                        </div>
                    </div>
                </div>

                {/* Notes & Terms */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-8">
                    <div className="flex-1">
                        <div className="text-xs font-bold text-indigo-700 mb-1">Notes</div>
                        <div className="text-gray-700 text-xs">{invoice.notes}</div>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-indigo-700 mb-1">Terms</div>
                        <div className="text-gray-700 text-xs">{invoice.terms}</div>
                    </div>
                </div>

                {/* Payment Details - always on next page when print/PDF */}
                <div className="page-break mt-8">
                    <div className="text-xs font-bold text-indigo-700 mb-1">Payment Details</div>
                    <div className="text-gray-700 text-xs">
                        <div><span className="font-semibold whitespace-pre-line break-words max-w-sm">Name:</span> {invoice.bank.receiverCompanyName}</div>
                        <div><span className="font-semibold">Bank:</span> {invoice.bank.name}</div>
                        <div><span className="font-semibold">A/C No.:</span> {invoice.bank.account}</div>
                        <div><span className="font-semibold">IFSC:</span> {invoice.bank.ifsc}</div>
                        <div><span className="font-semibold">Branch:</span> {invoice.bank.branch}</div>
                        <div><span className="font-semibold">UPI:</span> {invoice.bank.upi}</div>
                    </div>
                    <Link to='https://financesbazar.com' className='absolute bottom-4 left-4 text-blue-700 cursor-pointer text-xs'>
                        <span>https://financesbazar.com</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;