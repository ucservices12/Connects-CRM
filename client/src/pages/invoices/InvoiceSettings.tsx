import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Building2,
    FileText,
    CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    createInvoiceSetting,
    getInvoiceSetting
} from '../../machine/invoice';
import { toast } from '../../components/common/Toaster';
import LoadingScreen from '../../components/common/LoadingScreen';

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
        defaultTax: 0
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
    const { user, organization } = useAuth();
    const navigate = useNavigate();

    const [settings, setSettings] = useState<typeof defaultSettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<TabKey>('company');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await getInvoiceSetting(organization?._id);
                if (response?.invoice) {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');

                    response.invoice.prefix = response.invoice.prefix || `${year}/${month}`;
                    response.invoice.nextNumber = response.invoice.nextNumber || '0001';
                }
                setSettings(response);
                if (response?.company?.logoUrl) {
                    setLogoPreview(response.company.logoUrl);
                }
            } catch (err) {
                setError("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        }

        if (organization?._id) fetchSettings();
    }, [organization?._id]);

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

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && /\.(png|jpe?g)$/i.test(file.name)) {
            setLogoFile(file);
            const objectUrl = URL.createObjectURL(file);
            setLogoPreview(objectUrl);

            // Simulating upload URL assignment
            setSettings(prev => ({
                ...prev,
                company: {
                    ...prev.company,
                    logoUrl: objectUrl // In real app, replace with uploaded URL
                }
            }));
        } else {
            toast.error("Logo must be a .png or .jpg/.jpeg image.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                orgId: organization._id,
                settings
            };

            const response = await createInvoiceSetting(payload);
            console.log("create/update setting::", response);
            toast.success("Invoice settings saved successfully.");
        } catch (error) {
            console.error("Save settings error:", error);
            toast.error("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const renderFields = () => {
        switch (activeTab) {
            case 'company':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {['name', 'email', 'address', 'phone', 'website', 'gst', 'tan'].map(field => (
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
                                    value={settings.company?.[field] ?? ''}
                                    onChange={e => handleChange('company', field, e.target.value)}
                                />
                            </div>
                        ))}

                        {['city', 'state', 'zip'].map(field => (
                            <div key={field} className="form-group">
                                <label className="form-label capitalize">{field}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={settings.company?.[field] ?? ''}
                                    onChange={e => handleChange('company', field, e.target.value)}
                                />
                            </div>
                        ))}

                        {/* Logo File Input */}
                        <div className="form-group sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Company Logo (PNG/JPG)</label>
                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    className="form-input"
                                    onChange={handleLogoChange}
                                />
                                {logoPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="h-20 w-auto object-contain border rounded"
                                        />
                                    </div>
                                )}
                            </div>
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
                                value={settings.invoice?.prefix ?? ''}
                                onChange={e => handleChange('invoice', 'prefix', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Next Number</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.invoice?.nextNumber ?? ''}
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
                                value={settings.invoice?.defaultTax ?? 0}
                                onChange={e => handleChange('invoice', 'defaultTax', Number(e.target.value))}
                            />
                        </div>
                        <div className="form-group sm:col-span-2">
                            <label className="form-label">Terms</label>
                            <textarea
                                className="form-input"
                                rows={2}
                                value={settings.invoice?.terms ?? ''}
                                onChange={e => handleChange('invoice', 'terms', e.target.value)}
                            />
                        </div>
                        <div className="form-group sm:col-span-2">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-input"
                                rows={2}
                                value={settings.invoice?.notes ?? ''}
                                onChange={e => handleChange('invoice', 'notes', e.target.value)}
                            />
                        </div>
                    </div>
                );

            case 'payment':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {['bankName', 'accountName', 'accountNumber', 'ifscCode', 'upi'].map(field => (
                            <div key={field} className="form-group">
                                <label className="form-label capitalize">
                                    {field === 'upi'
                                        ? 'UPI ID'
                                        : field === 'ifscCode'
                                            ? 'IFSC Code'
                                            : field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={settings.payment?.[field] ?? ''}
                                    onChange={e => handleChange('payment', field, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };

    if (loading) return <LoadingScreen />;

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
