import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Send, UserPlus } from 'lucide-react';
import DatePicker from '../../components/common/DatePicker';
import ClientSelector from '../../components/invoices/ClientSelector';
import { createInvoice } from '../../machine/invoice';
import { useAuth } from '../../contexts/AuthContext';

// Client type
type Client = {
    id: string;
    company: string;
    name: string;
    address: string;
    email: string;
    phone?: string;
};

// Invoice item type
type InvoiceItem = {
    id: string;
    description: string;
    quantity: number;
    rate: number;
};

// Invoice status type
type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

// Invoice type
interface Invoice {
    id: string;
    clientId: string;
    invoiceNo: string;
    issueDate: Date;
    dueDate: Date;
    items: InvoiceItem[];
    notes: string;
    tax: number;
    discount: number;
    status: InvoiceStatus;
    terms: string;
}

// Initial clients (unique IDs, all fields present)
const initialClients: Client[] = [
    { id: '1', company: 'Acme Corp', name: 'Rahul Sharma', address: '123 Main St, Mumbai, Maharashtra, 400001, India', email: 'acme@example.com', phone: '9999999999' },
    { id: '2', company: 'Globex Ltd', name: 'Priya Singh', address: '456 Market Rd, Pune, Maharashtra, 411001, India', email: 'globex@example.com', phone: '8888888888' },
    { id: '3', company: 'Acme Corporation', name: 'John Smith', address: '789 Park Ave, Delhi, Delhi, 110001, India', email: 'john@acme.com', phone: '7777777777' },
    { id: '4', company: 'Globex Industries', name: 'Sarah Johnson', address: '321 River Rd, Bangalore, Karnataka, 560001, India', email: 'sarah@globex.com', phone: '6666666666' },
    { id: '5', company: 'Stark Enterprises', name: 'Tony Stark', address: '10880 Malibu Point, California, CA, 90265, USA', email: 'tony@stark.com', phone: '5555555555' },
    { id: '6', company: 'Wayne Industries', name: 'Bruce Wayne', address: '1007 Mountain Dr, Gotham, NY, 10001, USA', email: 'bruce@wayne.com', phone: '4444444444' },
    { id: '7', company: 'Umbrella Corp', name: 'Albert Wesker', address: 'Umbrella HQ, Raccoon City, Ohio, 43001, USA', email: 'wesker@umbrella.com', phone: '3333333333' },
];

// Default invoice item
const defaultItem = (): InvoiceItem => ({
    id: Date.now().toString() + Math.random(),
    description: '',
    quantity: 1,
    rate: 0,
});

const CreateInvoice: React.FC = () => {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
        company: '',
        name: '',
        address: '',
        email: '',
        phone: '',
    });

    console.log("Organization ID:", user?.organization);
    console.log("User ID:", user?._id);

    const [invoice, setInvoice] = useState<Invoice>({
        id: '',
        clientId: '',
        invoiceNo: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        issueDate: new Date(),
        dueDate: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 30);
            return d;
        })(),
        items: [defaultItem()],
        notes: '',
        tax: 0,
        discount: 0,
        status: 'Draft',
        terms: '',
    });

    // Calculations
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxAmount = (subtotal * invoice.tax) / 100;
    const discountAmount = (subtotal * invoice.discount) / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;
    const formatRupees = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // Handlers
    const handleField = (field: keyof Invoice, value: any) => {
        setInvoice(inv => ({ ...inv, [field]: value ?? 0 }));
    };

    const handleItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
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

    const removeItem = (id: string) => {
        setInvoice(inv => ({
            ...inv,
            items: inv.items.length > 1 ? inv.items.filter(item => item.id !== id) : inv.items,
        }));
    };

    // Add new client
    const handleAddClient = () => {
        if (!newClient.company.trim() || !newClient.name.trim() || !newClient.email.trim()) {
            alert("Company, Name, and Email are required.");
            return;
        }
        // Email validation (simple)
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newClient.email)) {
            alert("Please enter a valid email address.");
            return;
        }
        const clientToAdd: Client = {
            id: Date.now().toString(),
            ...newClient,
        };
        setClients(prev => [...prev, clientToAdd]);
        setInvoice(inv => ({ ...inv, clientId: clientToAdd.id }));
        setNewClient({ company: '', name: '', address: '', email: '', phone: '' });
        setShowAddClient(false);
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent, isDraft = true) => {
        e.preventDefault();
        const selectedClient = clients.find(c => c.id === invoice.clientId);
        if (!selectedClient || !user?.organization) {
            alert('Please select a client and organization.');
            return;
        }
        if (!invoice.invoiceNo.trim()) {
            alert('Invoice number is required.');
            return;
        }
        // Prepare address fields (split by comma)
        const addressString = selectedClient.address || '';
        const [street = '', city = '', state = '', zipCode = '', country = ''] = addressString.split(',').map(s => s.trim());

        // Validate items
        if (invoice.items.length === 0 || invoice.items.some(item => !item.description || item.quantity < 1 || item.rate < 0)) {
            alert('Please fill all invoice items with valid values.');
            return;
        }

        // Validate client email
        if (!selectedClient.email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(selectedClient.email)) {
            alert('Client email is required and must be valid.');
            return;
        }

        const invoiceData = {
            organizationId: (user?.organization).toString(),
            client: {
                name: selectedClient.name,
                email: selectedClient.email,
                phone: selectedClient.phone || '',
                address: {
                    street,
                    city,
                    state,
                    zipCode,
                    country,
                }
            },
            invoiceNo: invoice.invoiceNo,
            items: invoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.quantity * item.rate
            })),
            totalAmount: subtotal,
            tax: invoice.tax,
            discount: invoice.discount,
            grandTotal: grandTotal,
            status: isDraft ? 'Draft' : invoice.status,
            dueDate: invoice.dueDate,
            notes: invoice.notes,
            terms: invoice.terms,
            sentAt: null,
            paidAt: null,
            createdBy: user?._id || '',
        };
        console.log("Submitting Invoice Data:", invoiceData);
        await createInvoice(invoiceData);
        navigate('/invoices/list');
    };

    return (
        <div className="sm:space-y-6 space-y-4">
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

            <form onSubmit={e => handleSubmit(e, true)} className="card space-y-8">
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
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-input w-full"
                                            placeholder="Company Name"
                                            value={newClient.company}
                                            onChange={e => setNewClient(nc => ({ ...nc, company: e.target.value }))}
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
                                    <div className="sm:col-span-2">
                                        <textarea
                                            className="form-input w-full"
                                            placeholder="Address (comma separated: street, city, state, zip, country)"
                                            value={newClient.address}
                                            onChange={e => setNewClient(nc => ({ ...nc, address: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        className="btn-primary btn-sm"
                                        onClick={handleAddClient}
                                    >
                                        Add
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
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        className="form-input"
                        value={invoice.status}
                        onChange={e => handleField('status', e.target.value as InvoiceStatus)}
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
                        <div className="hidden sm:grid grid-cols-12 gap-2 px-2 text-sm text-neutral-500">
                            <div className="col-span-5">Description</div>
                            <div className="col-span-2">Quantity</div>
                            <div className="col-span-2">Rate</div>
                            <div className="col-span-2 text-right">Amount</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>
                        {invoice.items.map(item => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:grid grid-cols-12 gap-2 items-center bg-neutral-50 rounded-lg p-2"
                            >
                                <div className="col-span-5 w-full">
                                    <input
                                        type="text"
                                        className="form-input w-full"
                                        placeholder="Item description"
                                        value={item.description}
                                        onChange={e => handleItem(item.id, 'description', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 w-full flex sm:block justify-between items-center">
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
                                <div className="col-span-2 w-full flex sm:block justify-between items-center">
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
                                <div className="col-span-2 w-full flex sm:block justify-between items-center text-right">
                                    <span className="sm:hidden text-xs text-neutral-500 mr-2">Amount</span>
                                    <span className="block w-full">{formatRupees(item.quantity * item.rate)}</span>
                                </div>
                                <div className="col-span-1 flex justify-end w-full">
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
                            <textarea
                                className="form-input h-24"
                                placeholder="Payment terms, notes to client, etc."
                                value={invoice.notes}
                                onChange={e => handleField('notes', e.target.value)}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Terms</label>
                            <textarea
                                className="form-input h-16"
                                placeholder="Terms & Conditions"
                                value={invoice.terms}
                                onChange={e => handleField('terms', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>{formatRupees(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                                <span>Tax:</span>
                                <div className="w-16">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="form-input py-1 px-2 text-center"
                                        value={invoice.tax ?? 0}
                                        onChange={e => handleField('tax', Number(e.target.value))}
                                    />
                                </div>
                                <span>%</span>
                            </div>
                            <span>{formatRupees(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                            <div className="flex items-center gap-2">
                                <span>Discount:</span>
                                <div className="w-16">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="form-input py-1 px-2 text-center"
                                        value={invoice.discount ?? 0}
                                        onChange={e => handleField('discount', Number(e.target.value))}
                                    />
                                </div>
                                <span>%</span>
                            </div>
                            <span>-{formatRupees(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between py-3 font-medium text-lg">
                            <span>Grand Total:</span>
                            <span>{formatRupees(grandTotal)}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;