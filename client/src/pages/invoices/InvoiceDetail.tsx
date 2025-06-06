import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Edit, Printer, Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getInvoiceById } from '../../machine/invoice';
import { getStatusBadge } from './InvoiceList';

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

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = printStyles;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);

    useEffect(() => {
        const FetchInvoiceDetails = async () => {
            const response = await getInvoiceById(id);
            if (response.data) {
                setInvoiceDetails(response?.data)
            }
        }
        FetchInvoiceDetails()
    }, [id])

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
        pdf.save(`Invoice-${invoiceDetails?.invoiceNo}.pdf`);
        element.style.width = originalWidth;
        element.style.minHeight = '';
        element.style.maxHeight = '';
        element.style.height = originalHeight;
    };

    const handlePrint = () => {
        const oldTitle = document.title;
        document.title = `Invoice-${invoiceDetails?.invoiceNo}`;
        window.print();
        setTimeout(() => { document.title = oldTitle; }, 1000);
    };

    // Dynamic calculations
    const subtotal = invoiceDetails?.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0);
    const sgstAmount = (subtotal * (invoiceDetails?.sGST || 0)) / 100;
    const cgstAmount = (subtotal * (invoiceDetails?.cGST || 0)) / 100;
    const taxAmount = sgstAmount + cgstAmount;
    const discountAmount = (subtotal * (invoiceDetails?.discount || 0)) / 100;
    const total = subtotal + taxAmount - discountAmount;
    const paid = invoiceDetails?.paidAmount || 0;
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
                        <div className="ml-4">{getStatusBadge(invoiceDetails?.status)}</div>
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
                        <div className="font-bold text-black mb-1">
                            {invoiceDetails?.settings?.company?.name}
                        </div>
                        <div className='text-xs max-w-56'>
                            GST No:  {invoiceDetails?.settings?.company?.gst}<br />
                            TAN No:  {invoiceDetails?.settings?.company?.tan}<br />
                            {invoiceDetails?.settings?.company?.address},{" "}
                            {invoiceDetails?.settings?.company?.state},{" "}
                            {invoiceDetails?.settings?.company?.city}-  {invoiceDetails?.settings?.company?.zip}.<br />
                            {invoiceDetails?.settings?.company?.phone}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                    <div className="max-w-56">
                        <div className="text-xs font-bold text-gray-700 mb-1">Billed To</div>
                        <div className="text-gray-900 text-xs break-words">{invoiceDetails?.client?.name}</div>
                        <div className="text-gray-700 text-xs whitespace-pre-line break-words">{invoiceDetails?.client?.email}</div>
                        <div className="text-gray-700 text-xs whitespace-pre-line break-words">{invoiceDetails?.client?.phone}</div>
                        <div className="text-gray-700 text-xs whitespace-pre-line break-words">{formatAddress(invoiceDetails?.client.address)}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:gap-16 gap-4 text-xs w-full sm:w-auto">
                        <div>
                            <div className="text-xs font-bold text-gray-700">Order Date</div>
                            <div className="text-gray-900">
                                {new Date(invoiceDetails?.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </div>
                            <div className="text-xs font-bold text-gray-700 mt-2">Due Date</div>
                            <div className="text-gray-900">
                                {new Date(invoiceDetails?.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-700">Invoice Number</div>
                            <div className="text-gray-900 break-words">{invoiceDetails?.invoiceNo}</div>
                            <div className="text-xs font-bold text-gray-700 mt-2">Amount Due</div>
                            <div className="text-lg font-bold text-md text-green-500">{formatRupees(balanceDue)}</div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-indigo-600">
                                <th className="text-left py-2 text-xs font-bold text-indigo-700 uppercase">SR.</th>
                                <th className="text-left py-2 text-xs font-bold text-indigo-700 uppercase">Product</th>
                                <th className="text-right py-2 text-xs font-bold text-indigo-700 uppercase">Rate</th>
                                <th className="text-right py-2 text-xs font-bold text-indigo-700 uppercase">Qty</th>
                                <th className="text-right py-2 text-xs font-bold text-indigo-700 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceDetails?.items.map((item: any, idx: number) => (
                                <React.Fragment key={item.id}>
                                    <tr className="border-b border-gray-200">
                                        <td className="py-1.5 text-xs text-gray-500">{idx + 1}</td>
                                        <td className="py-1.5 text-xs font-semibold">{item?.description}</td>
                                        <td className="py-1.5 text-xs text-right">{formatRupees(item?.rate)}</td>
                                        <td className="py-1.5 text-xs text-right">{item?.quantity}</td>
                                        <td className="py-1.5 text-xs text-right">{formatRupees(item.quantity * item.rate)}</td>
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
                            <span className="text-gray-700">SGST ({invoiceDetails?.sGST}%)</span>
                            <span className="font-semibold">{formatRupees(sgstAmount)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">CGST ({invoiceDetails?.cGST}%)</span>
                            <span className="font-semibold">{formatRupees(cgstAmount)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">GST Tax ({invoiceDetails?.tax}%)</span>
                            <span className="font-semibold">{formatRupees(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-gray-700">Discount ({invoiceDetails?.discount}%)</span>
                            <span className="font-semibold text-green-700">-{formatRupees(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t border-gray-200 mt-2 text-md">
                            <span>Total</span>
                            <span>{formatRupees(total)}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b-2 border-indigo-600 font-semibold">
                            <span>Paid</span>
                            <span>{formatRupees(invoiceDetails?.paidAmount)}</span>
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
                        <div className="text-gray-700 text-xs">{invoiceDetails?.notes}</div>
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-indigo-700 mb-1">Terms</div>
                        <div className="text-gray-700 text-xs">{invoiceDetails?.terms}</div>
                    </div>
                </div>

                {/* Payment Details - always on next page when print/PDF */}
                <div className="page-break mt-8">
                    <div className="text-xs font-bold text-indigo-700 mb-1">Payment Details</div>
                    <div className="text-gray-700 text-xs">
                        <div><span className="font-semibold whitespace-pre-line break-words max-w-sm">Name:</span> {invoiceDetails?.settings?.payment?.accountName}</div>
                        <div><span className="font-semibold">Bank:</span> {invoiceDetails?.settings?.payment?.bankName}</div>
                        <div><span className="font-semibold">A/C No.:</span> {invoiceDetails?.settings?.payment?.accountNumber}</div>
                        <div><span className="font-semibold">IFSC:</span> {invoiceDetails?.settings?.payment?.ifscCode}</div>
                        <div><span className="font-semibold">Branch:</span> {invoiceDetails?.settings?.payment?.branch}</div>
                        <div><span className="font-semibold">UPI:</span> {invoiceDetails?.settings?.payment?.upi}</div>
                    </div>
                    <Link to={invoiceDetails?.settings?.company?.website} className='absolute bottom-4 left-4 text-blue-700 cursor-pointer text-xs'>
                        <span>{invoiceDetails?.settings?.company?.website}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;