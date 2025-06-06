import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Send, UserPlus, Settings } from 'lucide-react';
import DatePicker from '../../components/common/DatePicker';
import ClientSelector from '../../components/invoices/ClientSelector';
import { createInvoice } from '../../machine/invoice';
import { toast } from '../../components/common/Toaster';
import { TextareaAutosize } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchInvoiceSettings } from '../../redux/slices/invoiceSlice';

// Helpers
const defaultAddress = { street: '', city: '', state: '', zipCode: '', country: '' };
const defaultItem = () => ({
    id: Date.now().toString() + Math.random(),
    description: '',
    quantity: 1,
    rate: 0,
});

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const CreateInvoice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { organization, user } = useSelector((state: any) => state.auth);
    const { invoiceSettings } = useSelector((state: RootState) => state.invoice);

    useEffect(() => {
        if (organization?._id) {
            dispatch(fetchInvoiceSettings(organization._id));
        }
    }, [organization?._id, dispatch]);

    const [showDropdown, setShowDropdown] = useState<string | null>(null);

    // Helper to filter items
    const filteredOptions = (term) => {
        return (invoiceSettings?.invoice?.invoiceTypes || []).filter(type =>
            type.toLowerCase().includes(term.toLowerCase())
        );
    };

    useEffect(() => {
        if (invoiceSettings?.invoice?.prefix) {
            const generatedNo = `${invoiceSettings.invoice.prefix}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
            setInvoice((prevInvoice) => ({
                ...prevInvoice,
                invoiceNo: generatedNo,
                notes: invoiceSettings.invoice.notes || '',
                terms: invoiceSettings.invoice.terms || '',
            }));
        }
    }, [invoiceSettings]);

    // State
    const [clients, setClients] = useState([]);
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClient, setNewClient] = useState({ companyName: '', name: '', address: { ...defaultAddress }, email: '', phone: '' });
    const [invoice, setInvoice] = useState({
        clientId: '',
        invoiceNo: '',
        issueDate: new Date(),
        dueDate: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d; })(),
        items: [defaultItem()],
        notes: '',
        sGST: 0,
        discount: 0,
        status: '',
        terms: '',
        paidAmount: 0,
        settings: {
            invoiceSettings
        }
    });

    // Error state
    const [errors, setErrors] = useState({});
    const [clientAddError, setClientAddError] = useState('');

    // Calculations
    const cGST = invoice.sGST;
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const sgstAmount = (subtotal * invoice.sGST) / 100;
    const cgstAmount = (subtotal * cGST) / 100;
    const taxAmount = sgstAmount + cgstAmount;
    const discountAmount = (subtotal * invoice.discount) / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;
    const paidAmount = invoice.paidAmount || 0;
    const balanceDue = Math.max(grandTotal - paidAmount, 0);
    const formatRupees = amount => `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // Handlers
    const handleField = (field, value) => setInvoice(inv => ({ ...inv, [field]: value ?? 0 }));
    const handleItem = (id, field, value) =>
        setInvoice(inv => ({
            ...inv,
            items: inv.items.map(item =>
                item.id === id ? { ...item, [field]: field === 'description' ? value : Number(value) } : item
            ),
        }));
    const addItem = () => setInvoice(inv => ({ ...inv, items: [...inv.items, defaultItem()] }));
    const removeItem = id =>
        setInvoice(inv => ({
            ...inv,
            items: inv.items.length > 1 ? inv.items.filter(item => item.id !== id) : inv.items,
        }));

    // Add new client (with unique id)
    const handleAddClient = () => {
        let error = '';
        if (!newClient.companyName.trim()) error = 'Company is required.';
        else if (!newClient.name.trim()) error = 'Client name is required.';
        else if (!newClient.email.trim()) error = 'Client email is required.';
        else if (!emailRegex.test(newClient.email)) error = 'Please enter a valid email address.';
        if (error) {
            setClientAddError(error);
            return;
        }
        setClientAddError('');
        const clientToAdd = { id: Date.now().toString(), ...newClient, address: { ...newClient.address } };
        setClients(prev => [...prev, clientToAdd]);
        setInvoice(inv => ({ ...inv, clientId: clientToAdd.id }));
        setNewClient({ company: '', name: '', address: { ...defaultAddress }, email: '', phone: '' });
        setShowAddClient(false);
    };

    // Strong validation for invoice
    const validateInvoice = (selectedClient) => {
        const newErrors = {};
        if (!organization || !organization._id) {
            newErrors.organization = 'Organization is not loaded. Please refresh the page or contact support.';
        }
        if (!selectedClient) {
            newErrors.clientId = 'Please select a client.';
        } else {
            if (!selectedClient.companyName || !selectedClient.companyName.trim()) {
                newErrors.clientCompany = 'Client company name is required.';
            }
            if (!selectedClient.name || !selectedClient.name.trim()) {
                newErrors.clientName = 'Client name is required.';
            }
            if (!selectedClient.email || !emailRegex.test(selectedClient.email)) {
                newErrors.clientEmail = 'Client email is required and must be valid.';
            }
        }
        if (!invoice.invoiceNo.trim()) {
            newErrors.invoiceNo = 'Invoice number is required.';
        }
        if (!invoice.issueDate || isNaN(new Date(invoice.issueDate).getTime())) {
            newErrors.issueDate = 'Valid issue date is required.';
        }
        if (!invoice.dueDate || isNaN(new Date(invoice.dueDate).getTime())) {
            newErrors.dueDate = 'Valid due date is required.';
        }
        if (
            !invoice.items.length ||
            invoice.items.some(item =>
                !item.description ||
                item.description.trim().length === 0 ||
                item.quantity < 1 ||
                item.rate < 0 ||
                isNaN(item.quantity) ||
                isNaN(item.rate)
            )
        ) {
            newErrors.items = 'Please fill all invoice items with valid values (description, quantity > 0, rate >= 0).';
        }
        if (invoice.discount < 0 || invoice.discount > 100) {
            newErrors.discount = 'Discount must be between 0 and 100.';
        }
        if (invoice.sGST < 0 || invoice.sGST > 100) {
            newErrors.sGST = 'SGST must be between 0 and 100.';
        }
        if (invoice.paidAmount < 0) {
            newErrors.paidAmount = 'Paid amount cannot be negative.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedClient = clients.find(c => c.id === invoice.clientId);

        if (!validateInvoice(selectedClient)) return;

        const invoiceData = {
            orgId: organization._id,
            client: {
                clientId: selectedClient.id,
                companyName: selectedClient.companyName,
                name: selectedClient.name,
                email: selectedClient.email,
                phone: selectedClient.phone || '',
                address: { ...selectedClient.address },
            },
            invoiceNo: invoice.invoiceNo,
            items: invoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.quantity * item.rate,
            })),
            totalAmount: subtotal,
            sGST: invoice.sGST,
            cGST,
            tax: invoice.sGST + cGST,
            discount: invoice.discount,
            grandTotal,
            status: invoice.status,
            dueDate: invoice.dueDate,
            notes: invoice.notes,
            terms: invoice.terms,
            sentAt: '',
            paidAt: '',
            paidAmount: invoice.paidAmount,
            settings: {
                company: {
                    name: invoiceSettings?.company?.name || '',
                    address: invoiceSettings?.company?.address || '',
                    city: invoiceSettings?.company?.city || '',
                    state: invoiceSettings?.company?.state || '',
                    zip: invoiceSettings?.company?.zip || '',
                    phone: invoiceSettings?.company?.phone || '',
                    email: invoiceSettings?.company?.email || '',
                    website: invoiceSettings?.company?.website || '',
                    logoUrl: invoiceSettings?.company?.logoUrl || '',
                    gst: invoiceSettings?.company?.gst || '',
                    tan: invoiceSettings?.company?.tan || '',
                },
                invoice: {
                    prefix: invoiceSettings?.invoice?.prefix || '',
                    nextNumber: invoiceSettings?.invoice?.nextNumber || '',
                    terms: invoiceSettings?.invoice?.terms || '',
                    notes: invoiceSettings?.invoice?.notes || '',
                    defaultTax: invoiceSettings?.invoice?.defaultTax || 0,
                },
                payment: {
                    bankName: invoiceSettings?.payment?.bankName || '',
                    accountName: invoiceSettings?.payment?.accountName || '',
                    accountNumber: invoiceSettings?.payment?.accountNumber || '',
                    ifscCode: invoiceSettings?.payment?.ifscCode || '',
                    upi: invoiceSettings?.payment?.upi || '',
                },
            },
            createdBy: user?._id || '',
        };

        try {
            await createInvoice(invoiceData);
            navigate('/invoices/list');
            toast.success("Create New Invoice");
        } catch {
            setErrors({ submit: 'Failed to create invoice. Please try again.' });
        }
    };

    console.log("CreateInvoiceData =>", invoice);

    // Render
    return (
        <div className="sm:space-y-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">Create New Invoice</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn-outline" onClick={e => handleSubmit(e, true)}>
                        <Save size={18} /> Save as Draft
                    </button>
                    <button className="btn-primary" onClick={e => handleSubmit(e, false)}>
                        <Send size={18} /> Save & Send
                    </button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={e => handleSubmit(e, true)} className="card sm:p-6 p-4 space-y-3">
                {/* Client & Invoice Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">
                            Client <span className="text-danger-600">*</span>
                        </label>
                        <ClientSelector
                            selectedClient={invoice.clientId}
                            onChange={val => handleField('clientId', val)}
                            clients={clients}
                        />
                        {errors.clientId && <div className="text-red-600 text-sm mt-1">{errors.clientId}</div>}
                        <button
                            type="button"
                            className="mt-2 flex items-center text-primary-600 hover:underline text-sm"
                            onClick={() => setShowAddClient(v => !v)}
                        >
                            <UserPlus size={16} className="mr-1" />
                            Add New Client
                        </button>
                        {showAddClient && (
                            <div className="mt-3 p-3 rounded bg-neutral-50 border">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        className="form-input w-full capitalize"
                                        placeholder="Company Name"
                                        value={newClient.companyName}
                                        onChange={e => setNewClient(nc => ({ ...nc, companyName: e.target.value }))}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="form-input w-full capitalize"
                                        placeholder="Client Name"
                                        value={newClient.name}
                                        onChange={e => setNewClient(nc => ({ ...nc, name: e.target.value }))}
                                        required
                                    />
                                    <input
                                        type="email"
                                        className="form-input w-full"
                                        placeholder="Email"
                                        value={newClient.email}
                                        onChange={e => setNewClient(nc => ({ ...nc, email: e.target.value }))}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className="form-input w-full capitalize"
                                        placeholder="Phone"
                                        value={newClient.phone}
                                        onChange={e => setNewClient(nc => ({ ...nc, phone: e.target.value }))}
                                    />
                                    {/* Address fields */}
                                    {['street', 'city', 'state', 'zipCode', 'country'].map(field => (
                                        <input
                                            key={field}
                                            type="text"
                                            className="form-input capitalize"
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={newClient.address[field]}
                                            onChange={e =>
                                                setNewClient(nc => ({
                                                    ...nc,
                                                    address: { ...nc.address, [field]: e.target.value },
                                                }))
                                            }
                                        />
                                    ))}
                                </div>
                                {clientAddError && <div className="text-red-600 text-sm mt-2">{clientAddError}</div>}
                                <div className="flex gap-2 mt-4">
                                    <button type="button" className="btn-primary btn-sm" onClick={handleAddClient}>
                                        Add Client
                                    </button>
                                    <button type="button" className="btn-outline btn-sm" onClick={() => setShowAddClient(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                        {errors.clientCompany && <div className="text-red-600 text-sm mt-1">{errors.clientCompany}</div>}
                        {errors.clientName && <div className="text-red-600 text-sm mt-1">{errors.clientName}</div>}
                        {errors.clientEmail && <div className="text-red-600 text-sm mt-1">{errors.clientEmail}</div>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="form-group">
                            <label className="form-label">
                                Invoice # <span className="text-danger-600">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={invoice.invoiceNo}
                                onChange={e => handleField('invoiceNo', e.target.value)}
                                required
                            />
                            {errors.invoiceNo && <div className="text-red-600 text-sm mt-1">{errors.invoiceNo}</div>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Issue Date</label>
                            <DatePicker selectedDate={invoice.issueDate} onChange={date => handleField('issueDate', date)} />
                            {errors.issueDate && <div className="text-red-600 text-sm mt-1">{errors.issueDate}</div>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <DatePicker selectedDate={invoice.dueDate} onChange={date => handleField('dueDate', date)} />
                            {errors.dueDate && <div className="text-red-600 text-sm mt-1">{errors.dueDate}</div>}
                        </div>
                    </div>
                </div>

                {/* Invoice Status */}
                <div className="form-group max-w-xs">
                    <label className="form-label">Status</label>
                    <select className="form-input" value={invoice.status} onChange={e => handleField('status', e.target.value)}>
                        <option value="Pendding">Pending Payment</option>
                        <option value="Processing">Processing</option>
                        <option value="Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Failed">Failed</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>

                {/* Invoice Items */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-3">
                        Invoice Items <span className="text-danger-600">*</span>
                    </h3>
                    {errors.items && <div className="text-red-600 text-sm mb-2">{errors.items}</div>}
                    <div className="flex flex-col gap-4">
                        <div className="hidden sm:grid grid-cols-12 gap-2 px-2 text-sm text-neutral-500">
                            <div className="col-span-1">SR NO</div>
                            <div className="col-span-4">Product</div>
                            <div className="col-span-2">Quantity</div>
                            <div className="col-span-2">Rate</div>
                            <div className="col-span-2 text-right">Amount</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>
                        {invoice.items.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:grid grid-cols-12 gap-2 items-center bg-neutral-50 rounded-lg p-2"
                            >
                                <div className="sm:col-span-1 w-full flex sm:block justify-between items-center">
                                    <span className="sm:hidden text-xs text-neutral-500 mr-2">SR NO</span>
                                    <span>{index + 1}</span>
                                </div>
                                <div className="sm:col-span-4 col-span-5 w-full relative">
                                    <label className="sr-only" htmlFor={`description-${item.id}`}>Product</label>
                                    <input
                                        id={`description-${item.id}`}
                                        type="text"
                                        className="form-input w-full capitalize"
                                        placeholder="Add or Select Product"
                                        value={item.description}
                                        onChange={(e) => {
                                            handleItem(item.id, 'description', e.target.value);
                                            setShowDropdown(item.id);
                                        }}
                                        onFocus={() => setShowDropdown(item.id)}
                                        onBlur={() => setTimeout(() => setShowDropdown(null), 150)}
                                        autoComplete="off"
                                    />

                                    {showDropdown === item.id && filteredOptions(item.description).length > 0 && (
                                        <ul className="absolute z-50 w-full bg-white border border-neutral-200 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                                            {filteredOptions(item.description).map((option, idx) => (
                                                <li
                                                    key={idx}
                                                    className="px-4 py-2 hover:bg-neutral-100 cursor-pointer capitalize"
                                                    onMouseDown={() => {
                                                        handleItem(item.id, 'description', option);
                                                        setShowDropdown(null);
                                                    }}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="sm:col-span-2 col-span-2 w-full flex sm:block justify-between items-center">
                                    <span className="sm:hidden text-xs text-neutral-500 mr-2">Qty</span>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-input w-full"
                                        value={item.quantity}
                                        onChange={e => handleItem(item.id, 'quantity', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2 col-span-2 w-full flex sm:block justify-between items-center">
                                    <span className="sm:hidden text-xs text-neutral-500 mr-2">Rate</span>
                                    <div className="relative w-full">
                                        <span className="absolute left-3 top-2">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="form-input pl-7 w-full"
                                            value={item.rate}
                                            onChange={e => handleItem(item.id, 'rate', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2 col-span-2 w-full flex sm:block justify-between items-center text-right">
                                    <span className="sm:hidden text-xs text-neutral-500 mr-2">Amount</span>
                                    <span className="block w-full">{formatRupees(item.quantity * item.rate)}</span>
                                </div>
                                <div className="sm:col-span-1 col-span-1 flex justify-end w-full">
                                    <button
                                        type="button"
                                        className="p-1 text-danger-700 hover:text-danger-400 cursor-pointer rounded-full hover:bg-neutral-100"
                                        onClick={() => removeItem(item.id)}
                                        disabled={invoice.items.length === 1}
                                        title={invoice.items.length === 1 ? 'At least one item required' : 'Delete item'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn-outline mt-4" onClick={addItem}>
                        <Plus size={18} /> <span className="ml-1">Add Item</span>
                    </button>
                </div>

                {/* Notes, Discount, Tax, Terms, and Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <TextareaAutosize
                                aria-label="Notes"
                                placeholder="Payment terms, notes to client, etc."
                                minRows={3}
                                value={invoice?.notes}
                                onChange={e => handleField('notes', e.target.value)}
                                style={{
                                    width: "100%",
                                    borderRadius: 6,
                                    padding: 6,
                                    fontSize: 16,
                                    boxSizing: "border-box",
                                    resize: "vertical"
                                }}
                                className='form-input capitalize'
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Terms</label>
                            <TextareaAutosize
                                aria-label="Terms"
                                placeholder="Terms & Conditions"
                                minRows={3}
                                value={invoice?.terms}
                                onChange={e => handleField('terms', e.target.value)}
                                style={{
                                    width: "100%",
                                    borderRadius: 6,
                                    padding: 6,
                                    fontSize: 16,
                                    boxSizing: "border-box",
                                    resize: "vertical"
                                }}
                                className='form-input capitalize'
                            />
                        </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex justify-between py-2 border-b mb-3 border-red-600">
                            <span>Subtotal:</span>
                            <span>{formatRupees(subtotal)}</span>
                        </div>
                        <span className="text-gray-600 ml-2 text-sm">GST TAX:</span>
                        <div className="bg-neutral-200 p-4 rounded-xl">
                            <div className="flex justify-between items-center py-1">
                                <div className="flex items-center text-sm gap-2">
                                    <span>S GST</span>
                                    <div className="w-16">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="form-input py-1 px-2 text-center"
                                            value={invoice.sGST}
                                            onChange={e => handleField('sGST', Number(e.target.value))}
                                        />
                                    </div>
                                    <span>%</span>
                                </div>
                                <span>{formatRupees(sgstAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <div className="flex items-center text-sm gap-2">
                                    <span>C GST</span>
                                    <div className="w-16">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="form-input py-1 px-2 text-center"
                                            value={cGST}
                                            readOnly
                                        />
                                    </div>
                                    <span>%</span>
                                </div>
                                <span>{formatRupees(cgstAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 mt-3 border-gray-500 border-t">
                                <div className="flex items-center text-sm gap-2">
                                    <span>Tax:</span>
                                    <div className="w-16">
                                        <input
                                            type="number"
                                            className="form-input py-1 px-2 text-center"
                                            value={invoice.sGST + cGST}
                                            readOnly
                                        />
                                    </div>
                                    <span>%</span>
                                </div>
                                <span>{formatRupees(taxAmount)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-red-600">
                            <div className="flex items-center text-sm gap-2">
                                <span>Discount:</span>
                                <div className="w-16">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="form-input py-1 px-2 text-center"
                                        value={invoice.discount}
                                        onChange={e => handleField('discount', Number(e.target.value))}
                                    />
                                </div>
                                <span>%</span>
                            </div>
                            <span className="text-red-600">-{formatRupees(discountAmount)}</span>
                        </div>
                        {errors.discount && <div className="text-red-600 text-sm mt-1">{errors.discount}</div>}
                        {errors.sGST && <div className="text-red-600 text-sm mt-1">{errors.sGST}</div>}
                        <div className="flex justify-between py-3 font-medium text-sm">
                            <span>Grand Total:</span>
                            <span>{formatRupees(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between py-3 font-medium text-sm">
                            <span>Paid:</span>
                            <input
                                type="number"
                                min="0"
                                className="form-input py-1 px-2 text-center w-24"
                                value={invoice.paidAmount}
                                onChange={e => handleField('paidAmount', Number(e.target.value))}
                            />
                        </div>
                        {errors.paidAmount && <div className="text-red-600 text-sm mt-1">{errors.paidAmount}</div>}
                        <div className="flex justify-between py-3 font-medium text-green-600 text-sm">
                            <span>Balance Due:</span>
                            <span>{formatRupees(balanceDue)}</span>
                        </div>
                    </div>
                </div>
                {errors.submit && <div className="text-red-600 text-sm mt-2">{errors.submit}</div>}
            </form>
        </div>
    );
};

export default CreateInvoice;