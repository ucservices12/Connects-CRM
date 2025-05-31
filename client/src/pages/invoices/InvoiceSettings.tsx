import React, { useState } from 'react';
import { ArrowLeft, Save, Building2, FileText, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TABS = [
    { key: 'company', label: 'Company Info', icon: <Building2 size={18} /> },
    { key: 'invoice', label: 'Invoice Defaults', icon: <FileText size={18} /> },
    { key: 'payment', label: 'Payment Info', icon: <CreditCard size={18} /> }
];

const InvoiceSettings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        company: {
            name: 'Your Company Name',
            address: '123 Company St, Suite 101',
            city: 'San Francisco',
            state: 'CA',
            zip: '94103',
            phone: '(555) 123-4567',
            email: 'billing@yourcompany.com',
            website: 'www.yourcompany.com',
            logoUrl: ''
        },
        invoice: {
            prefix: 'INV-',
            nextNumber: '2025-056',
            terms: 'Payment is due within 30 days of invoice date.',
            notes: 'Thank you for your business!',
            defaultTax: 10
        },
        payment: {
            bankName: 'National Bank',
            accountName: 'Your Company LLC',
            accountNumber: '123456789',
            routingNumber: '987654321',
            paypal: 'payments@yourcompany.com'
        }
    });
    const [activeTab, setActiveTab] = useState<'company' | 'invoice' | 'payment'>('company');

    const handleChange = (section: string, field: string, value: string | number) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(settings);
        alert('Settings saved! (See console)');
    };

    const renderFields = () => {
        if (activeTab === 'company') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2  gap-2 sm:gap-4">
                    {['name', 'email', 'address', 'phone', 'website', 'logoUrl'].map(field => (
                        <div key={field} className="form-group">
                            <label className="form-label capitalize">{field === 'logoUrl' ? 'Logo URL' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                className="form-input"
                                value={settings.company[field as keyof typeof settings.company]}
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
                                value={settings.company[field as keyof typeof settings.company]}
                                onChange={e => handleChange('company', field, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            );
        }
        if (activeTab === 'invoice') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2  gap-2 sm:gap-4">
                    <div className="form-group">
                        <label className="form-label">Prefix</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.invoice.prefix}
                            onChange={e => handleChange('invoice', 'prefix', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Next Number</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.invoice.nextNumber}
                            onChange={e => handleChange('invoice', 'nextNumber', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Default Tax (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-input"
                            value={settings.invoice.defaultTax}
                            onChange={e => handleChange('invoice', 'defaultTax', Number(e.target.value))}
                        />
                    </div>
                    <div className="form-group sm:col-span-2">
                        <label className="form-label">Terms</label>
                        <textarea
                            className="form-input"
                            rows={2}
                            value={settings.invoice.terms}
                            onChange={e => handleChange('invoice', 'terms', e.target.value)}
                        />
                    </div>
                    <div className="form-group sm:col-span-2">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-input"
                            rows={2}
                            value={settings.invoice.notes}
                            onChange={e => handleChange('invoice', 'notes', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
        if (activeTab === 'payment') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {['bankName', 'accountName', 'accountNumber', 'routingNumber', 'paypal'].map(field => (
                        <div key={field} className="form-group">
                            <label className="form-label capitalize">{field === 'paypal' ? 'PayPal Email' : field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                            <input
                                type={field === 'paypal' ? 'email' : 'text'}
                                className="form-input"
                                value={settings.payment[field as keyof typeof settings.payment]}
                                onChange={e => handleChange('payment', field, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-neutral-100"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-medium">Invoice Settings</h1>
                </div>
            </div>
            {/* Tabs */}
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
                            onClick={() => setActiveTab(tab.key as any)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <form
                className="card p-4 sm:p-6"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                {renderFields()}
                <div className="mt-6 flex justify-end">
                    <button className="btn-primary w-full sm:w-auto" type="submit">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </form>
        </>
    );
};

export default InvoiceSettings;