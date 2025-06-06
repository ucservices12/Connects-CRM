import React, { useState, useEffect, ChangeEvent } from 'react';
import {
    ArrowLeft,
    Save,
    Building2,
    FileText,
    CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../components/common/Toaster';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoiceSettings, saveInvoiceSettings } from '../../redux/slices/invoiceSlice';
import { AppDispatch, RootState } from '../../redux/store';

type TabKey = 'company' | 'invoice' | 'payment';

const TABS: { key: TabKey; label: string; icon: JSX.Element }[] = [
    { key: 'company', label: 'Company Info', icon: <Building2 size={18} /> },
    { key: 'invoice', label: 'Invoice Defaults', icon: <FileText size={18} /> },
    { key: 'payment', label: 'Payment Info', icon: <CreditCard size={18} /> }
];

const defaultSettings = {
    company: {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        website: '',
        logoUrl: '',
        gst: '',
        tan: ''
    },
    invoice: {
        prefix: '',
        nextNumber: '',
        terms: '',
        notes: '',
        defaultTax: 0,
        invoiceTypes: [] as string[]
    },
    payment: {
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        upi: ''
    }
};

const InvoiceSettings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { invoiceSettings, saving, error } = useSelector((state: RootState) => state.invoice);
    const [settings, setSettings] = useState<typeof defaultSettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<TabKey>('company');
    const [newType, setNewType] = useState('');
    const organization = useSelector((state: RootState) => state.auth.organization);

    useEffect(() => {
        if (organization?._id) {
            dispatch(fetchInvoiceSettings(organization._id));
        }
    }, [organization?._id, dispatch]);

    useEffect(() => {
        if (invoiceSettings && Object.keys(invoiceSettings).length > 0) {
            setSettings(prev => ({
                ...prev,
                company: {
                    ...prev.company,
                    ...invoiceSettings.company
                },
                invoice: {
                    ...prev.invoice,
                    ...invoiceSettings.invoice,
                    invoiceTypes: invoiceSettings.invoice?.invoiceTypes ?? []
                },
                payment: {
                    ...prev.payment,
                    ...invoiceSettings.payment
                }
            }));
        }
    }, [invoiceSettings]);

    const handleChange = (
        section: keyof typeof settings,
        field: string,
        value: string | number
    ) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings(prev => ({
                    ...prev,
                    company: {
                        ...prev.company,
                        logoUrl: reader.result as string
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddInvoiceType = () => {
        const trimmed = newType.trim();
        if (!trimmed) return;
        if (settings.invoice.invoiceTypes.includes(trimmed)) {
            toast.error('Invoice type already exists.');
            return;
        }
        setSettings(prev => ({
            ...prev,
            invoice: {
                ...prev.invoice,
                invoiceTypes: [...prev.invoice.invoiceTypes, trimmed]
            }
        }));
        setNewType('');
    };

    const handleRemoveInvoiceType = (typeToRemove: string) => {
        setSettings(prev => ({
            ...prev,
            invoice: {
                ...prev.invoice,
                invoiceTypes: prev.invoice.invoiceTypes.filter(t => t !== typeToRemove)
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organization?._id) return;

        try {
            const payload = {
                orgId: organization._id,
                settings
            };
            await dispatch(saveInvoiceSettings(payload)).unwrap();
            toast.success("Invoice settings saved successfully.");
        } catch (err) {
            toast.error("Failed to save settings.");
            console.error("Save settings error:", err);
        }
    };

    const renderFields = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {['name', 'email', 'address', 'phone', 'website', 'gst', 'tan', 'city', 'state', 'zip'].map(field => (
                            <div key={field} className="form-group">
                                <label className="form-label capitalize">
                                    {field.toUpperCase() === 'GST'
                                        ? 'GST No'
                                        : field.toUpperCase() === 'TAN'
                                            ? 'TAN No'
                                            : field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    className="form-input"
                                    value={settings?.company?.[field] ?? ''}
                                    onChange={e => handleChange('company', field, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="form-group sm:col-span-2">
                            <label className="form-label">Company Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-input"
                                onChange={handleLogoChange}
                            />
                            {settings?.company?.logoUrl && (
                                <img
                                    src={settings?.company?.logoUrl}
                                    alt="Logo Preview"
                                    className="mt-2 w-32 h-32 object-contain border rounded"
                                />
                            )}
                        </div>
                    </div>
                );

            case 'invoice':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        <div className="form-group">
                            <label className="form-label">Prefix</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.invoice?.prefix ?? ''}
                                onChange={e => handleChange('invoice', 'prefix', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Next Number</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.invoice?.nextNumber ?? ''}
                                onChange={e => handleChange('invoice', 'nextNumber', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Default Tax (%)</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                className="form-input"
                                value={settings?.invoice?.defaultTax ?? 0}
                                onChange={e => handleChange('invoice', 'defaultTax', Number(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Terms</label>
                            <textarea
                                className="form-input"
                                rows={2}
                                value={settings?.invoice?.terms ?? ''}
                                onChange={e => handleChange('invoice', 'terms', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-input"
                                rows={2}
                                value={settings?.invoice?.notes ?? ''}
                                onChange={e => handleChange('invoice', 'notes', e.target.value)}
                            />
                        </div>
                        {/* Custom Invoice Types */}
                        <div className="form-group">
                            <label className="form-label">Invoice Types</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="form-input flex-1"
                                    placeholder="Add new invoice type"
                                    value={newType}
                                    onChange={e => setNewType(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddInvoiceType();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={handleAddInvoiceType}
                                >
                                    Add
                                </button>
                            </div>

                            {Array.isArray(settings?.invoice?.invoiceTypes) && settings?.invoice?.invoiceTypes.length > 0 ? (
                                <ul className="flex flex-wrap gap-2">
                                    {settings?.invoice?.invoiceTypes?.map(type => (
                                        <li key={type} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                            <span className="mr-2 text-sm">{type}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInvoiceType(type)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-neutral-500 italic">No invoice types added yet.</p>
                            )}
                        </div>
                    </div>
                );

            case 'payment':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {['bankName', 'accountName', 'accountNumber', 'ifscCode', 'upi'].map(field => (
                            <div key={field} className="form-group">
                                <label className="form-label capitalize">
                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={settings?.payment?.[field] ?? ''}
                                    onChange={e => handleChange('payment', field, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">Invoice Settings</h1>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex border-b border-neutral-200 overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                                ${activeTab === tab.key
                                    ? 'border-primary-600 text-primary-700 bg-primary-50'
                                    : 'border-transparent text-neutral-600 hover:bg-neutral-50'
                                }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <form className="card p-4 sm:p-6" onSubmit={handleSubmit} autoComplete="off">
                {renderFields()}
                {error && <p className="text-red-600 mt-2">{error}</p>}
                <div className="mt-6 flex justify-end">
                    <button className="btn-primary w-full sm:w-auto" type="submit" disabled={saving}>
                        <Save size={18} className="mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default InvoiceSettings;
