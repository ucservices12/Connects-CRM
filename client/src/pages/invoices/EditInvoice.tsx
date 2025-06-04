import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Send, UserPlus } from 'lucide-react';
import ClientSelector from '../../components/invoices/ClientSelector';
import DatePicker from '../../components/common/DatePicker';
import { getInvoiceById, updateInvoice } from '../../machine/invoice';
import { TextareaAutosize, Typography } from '@mui/material';
import { toast } from '../../components/common/Toaster';
import { useAuth } from '../../contexts/AuthContext';

const defaultItem = () => ({
    id: Date.now().toString() + Math.random(),
    description: '',
    quantity: 1,
    rate: 0,
});

const defaultAddress = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
};

const EditInvoice = () => {
    const { organization, user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [clients, setClients] = useState([
        {
            id: '1',
            companyName: 'Acme Corp',
            name: 'Rahul Sharma',
            address: {
                street: '123 Main St',
                city: 'Mumbai',
                state: 'Maharashtra',
                zipCode: '400001',
                country: 'India'
            },
            email: 'acme@example.com',
            phone: '9999999999'
        },
    ]);
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClient, setNewClient] = useState({
        companyName: '',
        name: '',
        address: { ...defaultAddress },
        email: '',
        phone: '',
    });

    const [invoice, setInvoice] = useState({
        id: id || '',
        clientId: '',
        invoiceNo: '',
        issueDate: new Date(),
        dueDate: new Date(),
        items: [defaultItem()],
        notes: '',
        sGST: 0,
        cGST: 0,
        tax: 0,
        discount: 0,
        status: 'Draft',
        terms: '',
        paidAmount: 0,
    });

    // Error message state
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch invoice data
    useEffect(() => {
        const Editinvoice = async () => {
            try {
                const response = await getInvoiceById(id);
                const data = response?.data;

                setInvoice(prev => ({
                    ...prev,
                    clientId: data?.client?._id || data?.clientId || '',
                    invoiceNo: data?.invoiceNo || '',
                    issueDate: data?.createdAt ? new Date(data?.createdAt) : new Date(),
                    dueDate: data?.dueDate ? new Date(data?.dueDate) : new Date(),
                    items: data?.items && data?.items.length > 0 ? data?.items.map(item => ({
                        ...item,
                        id: item.id || Date.now().toString() + Math.random()
                    })) : [defaultItem()],
                    notes: data?.notes || '',
                    sGST: data?.sGST || 0,
                    cGST: data?.cGST || 0,
                    tax: data?.tax || 0,
                    discount: data?.discount || 0,
                    status: data?.status || 'Draft',
                    terms: data?.terms || '',
                    paidAmount: data?.paidAmount || 0,
                }));

                console.log("data", data)

                setClients(prev => {
                    // Add the client from invoice if not already present
                    const clientId = data?.client?._id || data?.clientId;
                    if (!clientId) return prev;
                    const exists = prev.some(c => c.id === clientId);
                    if (exists) return prev;
                    return [
                        ...prev,
                        {
                            id: clientId,
                            companyName: data?.client?.companyName,
                            name: data?.client?.name,
                            address: {
                                street: data?.client?.address?.street,
                                city: data?.client?.address?.city,
                                state: data?.client?.address?.state,
                                zipCode: data?.client?.address?.zipCode,
                                country: data?.client?.address?.country,
                            },
                            email: data?.client?.email,
                            phone: data?.client?.phone,
                        }
                    ];
                });

            } catch (error) {
                setErrorMsg("Invoice Edit Problem: " + (error?.message || "Unknown error"));
            }
        };
        Editinvoice();
    }, [id]);

    // Sync cGST with sGST and update tax
    useEffect(() => {
        setInvoice(prev => ({
            ...prev,
            cGST: prev.sGST,
            tax: prev.sGST + prev.cGST
        }));
    }, [invoice.sGST]);

    useEffect(() => {
        setInvoice(prev => ({
            ...prev,
            tax: prev.sGST + prev.cGST
        }));
    }, [invoice.cGST]);

    // Calculations
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = (subtotal * (invoice.cGST + invoice.sGST)) / 100;
    const discountAmount = (subtotal * invoice.discount) / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;
    const paidAmount = invoice.paidAmount || 0;
    const balanceDue = Math.max(grandTotal - paidAmount, 0);
    const formatRupees = amount => `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // Handlers
    const handleField = (field, value) => {
        setInvoice(inv => ({ ...inv, [field]: value ?? 0 }));
    };

    const handleItem = (id, field, value) => {
        setInvoice(inv => ({
            ...inv,
            items: inv.items.map(item =>
                item.id === id
                    ? { ...item, [field]: field === 'description' ? value : Number(value) }
                    : item
            ),
        }));
    };

    const addItem = () => setInvoice(inv => ({
        ...inv,
        items: [...inv.items, defaultItem()],
    }));

    const removeItem = (id) => {
        setInvoice(inv => ({
            ...inv,
            items: inv.items.length > 1 ? inv.items.filter(item => item.id !== id) : inv.items,
        }));
    };

    // Add new client
    const handleAddClient = () => {
        setErrorMsg('');
        if (!newClient.companyName.trim() || !newClient.name.trim() || !newClient.email.trim()) {
            setErrorMsg("Company, Name, and Email are required.");
            return;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newClient.email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }
        const clientToAdd = {
            id: Date.now().toString(),
            ...newClient,
            address: { ...newClient.address }
        };
        setClients(prev => [...prev, clientToAdd]);
        setInvoice(inv => ({ ...inv, clientId: clientToAdd.id }));
        setNewClient({
            companyName: '',
            name: '',
            address: { ...defaultAddress },
            email: '',
            phone: '',
        });
        setShowAddClient(false);
    };

    // Submit handler
    const handleSubmit = async (e, isDraft = true) => {
        e.preventDefault();
        setErrorMsg('');

        const selectedClient = clients.find(c => c.id === invoice.clientId);
        if (!selectedClient) {
            setErrorMsg('Please select a client.');
            return;
        }
        if (!invoice.invoiceNo.trim()) {
            setErrorMsg('Invoice number is required.');
            return;
        }
        if (invoice.items.length === 0 || invoice.items.some(item => !item.description || item.quantity < 1 || item.rate < 0)) {
            setErrorMsg('Please fill all invoice items with valid values.');
            return;
        }
        if (!selectedClient.email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(selectedClient.email)) {
            setErrorMsg('Client email is required and must be valid.');
            return;
        }

        const invoiceData = {
            orgId: organization?._id,
            client: {
                companyName: selectedClient?.companyName,
                name: selectedClient?.name,
                email: selectedClient?.email,
                phone: selectedClient?.phone || '',
                address: { ...selectedClient?.address },
            },
            invoiceNo: invoice?.invoiceNo,
            items: invoice?.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.quantity * item.rate,
            })),
            totalAmount: subtotal,
            sGST: invoice?.sGST,
            cGST: invoice?.cGST,
            tax: invoice?.sGST + invoice?.cGST,
            discount: invoice?.discount,
            grandTotal,
            status: isDraft ? 'Draft' : invoice?.status,
            dueDate: invoice?.dueDate,
            notes: invoice?.notes,
            terms: invoice?.terms,
            sentAt: '',
            paidAt: '',
            paidAmount: invoice?.paidAmount,
            createdBy: user?._id || '',
        };

        try {
            const response = await updateInvoice(id, invoiceData);
            // toast.success("Invoice updated successfully!");
            console.log("update profile =>", response?.data)
            navigate('/invoices/list');
        } catch (error) {
            setErrorMsg("Failed to update invoice.");
        }
    };

    return (
        <div className="sm:space-y-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft size={20} />
                    </button>
                    <Typography variant='h5'>Edit Invoice {invoice.invoiceNo}</Typography>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:mt-0 mt-6">
                    <button className="btn-outline" onClick={e => handleSubmit(e, true)}>
                        <Save size={18} /> Save Changes
                    </button>
                    <button className="btn-primary" onClick={e => handleSubmit(e, false)}>
                        <Send size={18} /> Save & Send
                    </button>
                </div>
            </div>

            {/* Error message */}
            {errorMsg && (
                <div className="mb-4 text-red-600 font-medium text-sm">{errorMsg}</div>
            )}

            <form onSubmit={e => handleSubmit(e, true)} className="card space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="form-label">Client <span className="text-danger-600">*</span></label>
                        <ClientSelector
                            selectedClient={invoice.clientId}
                            onChange={val => handleField('clientId', val)}
                            clients={clients}
                        />
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
                                {/* Error message for add client */}
                                {errorMsg && (
                                    <div className="mb-2 text-red-600 font-medium text-sm">{errorMsg}</div>
                                )}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-input w-full"
                                            placeholder="Company Name"
                                            value={newClient.companyName}
                                            onChange={e => setNewClient(nc => ({ ...nc, companyName: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-input w-full"
                                            placeholder="Client Name"
                                            value={newClient.name}
                                            onChange={e => setNewClient(nc => ({ ...nc, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            className="form-input w-full"
                                            placeholder="Email"
                                            value={newClient.email}
                                            onChange={e => setNewClient(nc => ({ ...nc, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-input w-full"
                                            placeholder="Phone"
                                            value={newClient.phone}
                                            onChange={e => setNewClient(nc => ({ ...nc, phone: e.target.value }))}
                                        />
                                    </div>
                                    {/* Address fields */}
                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-5 gap-2">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Street"
                                            value={newClient.address.street}
                                            onChange={e => setNewClient(nc => ({
                                                ...nc,
                                                address: { ...nc.address, street: e.target.value }
                                            }))}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="City"
                                            value={newClient.address.city}
                                            onChange={e => setNewClient(nc => ({
                                                ...nc,
                                                address: { ...nc.address, city: e.target.value }
                                            }))}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="State"
                                            value={newClient.address.state}
                                            onChange={e => setNewClient(nc => ({
                                                ...nc,
                                                address: { ...nc.address, state: e.target.value }
                                            }))}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Zip"
                                            value={newClient.address.zipCode}
                                            onChange={e => setNewClient(nc => ({
                                                ...nc,
                                                address: { ...nc.address, zipCode: e.target.value }
                                            }))}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Country"
                                            value={newClient.address.country}
                                            onChange={e => setNewClient(nc => ({
                                                ...nc,
                                                address: { ...nc.address, country: e.target.value }
                                            }))}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn-primary btn-sm"
                                        onClick={handleAddClient}
                                    >
                                        Add Client
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-outline btn-sm"
                                        onClick={() => setShowAddClient(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="form-group">
                            <label className="form-label">Invoice # <span className="text-danger-600">*</span></label>
                            <input
                                type="text"
                                className="form-input"
                                value={invoice.invoiceNo}
                                onChange={e => handleField('invoiceNo', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Issue Date</label>
                            <DatePicker
                                selectedDate={invoice.issueDate}
                                onChange={date => handleField('issueDate', date)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <DatePicker
                                selectedDate={invoice.dueDate}
                                onChange={date => handleField('dueDate', date)}
                            />
                        </div>
                    </div>
                </div>

                {/* Invoice Status */}
                <div className="form-group max-w-xs">
                    <label className="form-label">Status</label>
                    <select
                        className="form-input"
                        value={invoice.status}
                        onChange={e => handleField('status', e.target.value)}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Invoice Items */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium mb-3">Invoice Items <span className="text-danger-600">*</span></h3>
                    <div className="flex flex-col gap-4">
                        {/* Responsive Table Header */}
                        <div className="hidden sm:grid grid-cols-12 gap-2 px-2 text-sm text-neutral-500">
                            <div className="col-span-1">SR NO</div>
                            <div className="col-span-4">Description</div>
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
                                {/* Row number for mobile/desktop */}
                                <div className="sm:col-span-1 w-full flex sm:block justify-between items-center">
                                    <span className="sm:hidden text-xs text-neutral-500 mr-2">SR NO.</span>
                                    <span>{index + 1}</span>
                                </div>
                                <div className="sm:col-span-4 col-span-5 w-full">
                                    <input
                                        type="text"
                                        className="form-input w-full"
                                        placeholder="Item description"
                                        value={item.description}
                                        onChange={e => handleItem(item.id, 'description', e.target.value)}
                                        required
                                    />
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
                                        title={invoice.items.length === 1 ? "At least one item required" : "Delete item"}
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
                                value={invoice.notes}
                                onChange={e => handleField('notes', e.target.value)}
                                style={{
                                    width: "100%",
                                    borderRadius: 6,
                                    padding: 6,
                                    fontSize: 16,
                                    boxSizing: "border-box",
                                    resize: "vertical"
                                }}
                                className='form-input'
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Terms</label>
                            <TextareaAutosize
                                aria-label="Terms"
                                placeholder="Terms & Conditions"
                                minRows={3}
                                value={invoice.terms}
                                onChange={e => handleField('terms', e.target.value)}
                                style={{
                                    width: "100%",
                                    borderRadius: 6,
                                    padding: 6,
                                    fontSize: 16,
                                    boxSizing: "border-box",
                                    resize: "vertical"
                                }}
                                className='form-input'
                            />
                        </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex justify-between py-2 border-b mb-3 border-red-600">
                            <span>Subtotal:</span>
                            <span>{formatRupees(subtotal)}</span>
                        </div>
                        <span className='text-gray-600 ml-2 text-sm'>GST TAX:</span>
                        <div className='bg-neutral-200 p-4 rounded-xl'>
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
                                            onChange={e => setInvoice(prev => ({
                                                ...prev,
                                                sGST: Number(e.target.value)
                                            }))}
                                        />
                                    </div>
                                    <span>%</span>
                                </div>
                                <span>{formatRupees(taxAmount)}</span>
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
                                            value={invoice.cGST}
                                            readOnly
                                        />
                                    </div>
                                    <span>%</span>
                                </div>
                                <span>{formatRupees(taxAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 mt-3 border-gray-500 border-t">
                                <div className="flex items-center text-sm gap-2">
                                    <span>Tax:</span>
                                    <div className="w-16">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="form-input py-1 px-2 text-center"
                                            value={invoice.tax}
                                            readOnly
                                        />
                                    </div>
                                    <span>%</span>
                                </div>
                                <span>{formatRupees(taxAmount + taxAmount)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-neutral-200">
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
                            <span className='text-red-600'>-{formatRupees(discountAmount)}</span>
                        </div>
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
                        <div className="flex justify-between py-3 font-medium text-green-600 text-sm">
                            <span>Balance Due:</span>
                            <span>{formatRupees(balanceDue)}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditInvoice;