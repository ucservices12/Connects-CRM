import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Eye, Plus, X, Save, FileText } from 'lucide-react';
import FileAttachments from '../../components/invoices/FileAttachments';
import EmailTemplateEditor from '../../components/invoices/EmailTemplateEditor';
import LoadingScreen from '../../components/common/LoadingScreen';

interface Invoice {
    id: string;
    invoiceNumber: string;
    client: { id: string; name: string; company: string; email: string };
    amount: number;
    dueDate: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue';
}

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
}

const SendInvoice = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState<Invoice | null>(null);

    const [to, setTo] = useState<string[]>([]);
    const [cc, setCc] = useState<string[]>([]);
    const [bcc, setBcc] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [includeInvoicePDF, setIncludeInvoicePDF] = useState(true);
    const [includePaymentLink, setIncludePaymentLink] = useState(true);

    const [showTemplateEditor, setShowTemplateEditor] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [templates, setTemplates] = useState<EmailTemplate[]>([
        {
            id: '1',
            name: 'New Invoice',
            subject: 'Invoice {invoice_number} from {company_name}',
            content: 'Dear {client_name},\n\nPlease find attached invoice {invoice_number} for ₹{amount}.\n\nPayment is due by {due_date}.\n\nBest regards,\n{company_name}'
        },
        {
            id: '2',
            name: 'Payment Reminder',
            subject: 'Reminder: Invoice {invoice_number} Payment Due',
            content: 'Dear {client_name},\n\nThis is a friendly reminder that payment for invoice {invoice_number} in the amount of ₹{amount} is due on {due_date}.\n\nIf you have already made the payment, please disregard this message.\n\nBest regards,\n{company_name}'
        }
    ]);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        setTimeout(() => {
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
                status: 'draft'
            };
            setInvoice(mockInvoice);
            setTo([mockInvoice.client.email]);
            setSubject(`Invoice ${mockInvoice.invoiceNumber} from Your Company`);
            setMessage(templates[0].content
                .replace('{client_name}', mockInvoice.client.name)
                .replace('{invoice_number}', mockInvoice.invoiceNumber)
                .replace('{amount}', mockInvoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
                .replace('{due_date}', new Date(mockInvoice.dueDate).toLocaleDateString('en-IN'))
                .replace('{company_name}', 'Your Company')
            );
            setLoading(false);
        }, 400);
        // eslint-disable-next-line
    }, [id]);

    const handleEmailList = (
        list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        value: string
    ) => {
        if (value && !list.includes(value)) setList([...list, value]);
    };
    const removeEmail = (
        list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        value: string
    ) => setList(list.filter(email => email !== value));

    const handleAddFiles = (files: File[]) => setAttachedFiles(prev => [...prev, ...files]);
    const handleRemoveFile = (file: File) => setAttachedFiles(prev => prev.filter(f => f !== file));

    const applyTemplate = (template: EmailTemplate) => {
        if (!invoice) return;
        setSubject(template.subject
            .replace('{invoice_number}', invoice.invoiceNumber)
            .replace('{company_name}', 'Your Company')
        );
        setMessage(template.content
            .replace('{client_name}', invoice.client.name)
            .replace('{invoice_number}', invoice.invoiceNumber)
            .replace('{amount}', invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }))
            .replace('{due_date}', new Date(invoice.dueDate).toLocaleDateString('en-IN'))
            .replace('{company_name}', 'Your Company')
        );
    };

    const handleSaveTemplate = (template: EmailTemplate) => {
        if (template.id) {
            setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        } else {
            setTemplates(prev => [...prev, { ...template, id: Date.now().toString() }]);
        }
    };

    const handleDeleteTemplate = (templateId: string) => {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
    };

    const handleSend = () => {
        console.log({
            to, cc, bcc, subject, message,
            includeInvoicePDF, includePaymentLink, attachedFiles, invoiceId: id
        });
        navigate(`/invoices/${id}`);
    };

    if (loading || !invoice) return <LoadingScreen />;

    // Responsive input list
    const EmailInputList = ({
        label, value, setValue
    }: { label: string, value: string[], setValue: React.Dispatch<React.SetStateAction<string[]>> }) => (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div className="flex flex-wrap gap-2 p-2 border border-neutral-300 rounded-md mb-1 bg-white">
                {value.map(email => (
                    <div key={email} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full flex items-center">
                        <span>{email}</span>
                        <button
                            type="button"
                            className="ml-1 text-primary-600 hover:text-primary-800"
                            onClick={() => removeEmail(value, setValue, email)}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <input
                    type="email"
                    className="flex-grow border-none focus:outline-none focus:ring-0 min-w-[120px] bg-transparent"
                    placeholder={`Enter email address`}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleEmailList(value, setValue, e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                    onBlur={e => {
                        if (e.target.value) {
                            handleEmailList(value, setValue, e.target.value);
                            e.target.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">Send Invoice {invoice.invoiceNumber}</h1>
                </div>
                <div className="flex gap-3">
                    <button className="btn-outline" onClick={() => setShowPreview(true)}>
                        <Eye size={18} />
                        Preview
                    </button>
                    <button className="btn-primary" onClick={handleSend}>
                        <Send size={18} />
                        Send Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="card p-4 sm:p-6">
                        <form onSubmit={e => { e.preventDefault(); handleSend(); }}>
                            <EmailInputList label="To" value={to} setValue={setTo} />
                            <EmailInputList label="CC" value={cc} setValue={setCc} />
                            <EmailInputList label="BCC" value={bcc} setValue={setBcc} />

                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-input h-48"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Attachments</label>
                                <FileAttachments
                                    files={attachedFiles}
                                    onAddFiles={handleAddFiles}
                                    onRemoveFile={handleRemoveFile}
                                />
                            </div>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="includeInvoicePDF"
                                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                        checked={includeInvoicePDF}
                                        onChange={e => setIncludeInvoicePDF(e.target.checked)}
                                    />
                                    <label htmlFor="includeInvoicePDF" className="ml-2 text-neutral-700">
                                        Attach invoice as PDF
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="includePaymentLink"
                                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                        checked={includePaymentLink}
                                        onChange={e => setIncludePaymentLink(e.target.checked)}
                                    />
                                    <label htmlFor="includePaymentLink" className="ml-2 text-neutral-700">
                                        Include payment link
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    {/* Invoice Summary */}
                    <div className="card p-4 sm:p-6 mb-6">
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
                                <p className="font-medium">₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-sm">Due Date:</span>
                                <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div>
                                <span className="text-neutral-500 text-sm">Status:</span>
                                <p className="font-medium capitalize">{invoice.status}</p>
                            </div>
                        </div>
                    </div>
                    {/* Email Templates */}
                    <div className="card p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Email Templates</h2>
                            <button
                                className="text-primary-600 hover:text-primary-700"
                                onClick={() => { setSelectedTemplate(null); setShowTemplateEditor(true); }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    className="p-3 border border-neutral-200 rounded-lg hover:border-primary-500 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">{template.name}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                className="p-1 text-neutral-500 hover:text-primary-600"
                                                onClick={() => { setSelectedTemplate(template); setShowTemplateEditor(true); }}
                                            >
                                                <Save size={16} />
                                            </button>
                                            <button
                                                className="p-1 text-neutral-500 hover:text-danger-600"
                                                onClick={() => handleDeleteTemplate(template.id)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-600 truncate">{template.subject}</p>
                                    <button
                                        className="mt-2 text-primary-600 hover:underline text-sm"
                                        onClick={() => applyTemplate(template)}
                                    >
                                        Use Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Editor Modal */}
            {showTemplateEditor && (
                <EmailTemplateEditor
                    onClose={() => setShowTemplateEditor(false)}
                    onSave={handleSaveTemplate}
                    initialTemplate={selectedTemplate}
                />
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-2 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">Email Preview</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-neutral-500 hover:text-neutral-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-neutral-50 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-neutral-500">From:</span>
                                        <p>Your Company Name &lt;billing@yourcompany.com&gt;</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-neutral-500">To:</span>
                                        <p>{to.join(', ')}</p>
                                    </div>
                                    {cc.length > 0 && (
                                        <div>
                                            <span className="text-sm text-neutral-500">CC:</span>
                                            <p>{cc.join(', ')}</p>
                                        </div>
                                    )}
                                    {bcc.length > 0 && (
                                        <div>
                                            <span className="text-sm text-neutral-500">BCC:</span>
                                            <p>{bcc.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-neutral-500">Subject:</span>
                                <p className="font-medium">{subject}</p>
                            </div>
                            <div>
                                <span className="text-sm text-neutral-500">Message:</span>
                                <div className="mt-2 p-4 bg-white border border-neutral-200 rounded-lg whitespace-pre-wrap">
                                    {message}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-neutral-500">Attachments:</span>
                                <div className="mt-2 space-y-2">
                                    {includeInvoicePDF && (
                                        <div className="flex items-center p-2 bg-neutral-50 rounded">
                                            <FileText size={16} className="text-neutral-500 mr-2" />
                                            <span>Invoice_{invoice.invoiceNumber}.pdf</span>
                                        </div>
                                    )}
                                    {attachedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center p-2 bg-neutral-50 rounded">
                                            <FileText size={16} className="text-neutral-500 mr-2" />
                                            <span>{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button className="btn-outline" onClick={() => setShowPreview(false)}>
                                Close Preview
                            </button>
                            <button className="btn-primary" onClick={handleSend}>
                                <Send size={18} />
                                Send Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SendInvoice;