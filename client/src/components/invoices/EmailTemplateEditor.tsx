import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface EmailTemplateEditorProps {
    onClose: () => void;
    onSave: (template: EmailTemplate) => void;
    initialTemplate?: EmailTemplate;
}

interface EmailTemplate {
    id?: string;
    name: string;
    subject: string;
    content: string;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
    onClose,
    onSave,
    initialTemplate
}) => {
    const [template, setTemplate] = useState<EmailTemplate>(
        initialTemplate || {
            name: '',
            subject: '',
            content: ''
        }
    );

    const handleChange = (field: keyof EmailTemplate, value: string) => {
        setTemplate(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(template);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl mx-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                        {initialTemplate ? 'Edit Template' : 'Create Template'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="form-label">Template Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={template.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="e.g., Payment Reminder"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Subject Line</label>
                        <input
                            type="text"
                            className="form-input"
                            value={template.subject}
                            onChange={e => handleChange('subject', e.target.value)}
                            placeholder="e.g., Invoice {invoice_number} from {company_name}"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Email Content</label>
                        <textarea
                            className="form-input h-48"
                            value={template.content}
                            onChange={e => handleChange('content', e.target.value)}
                            placeholder="Write your email template here..."
                            required
                        ></textarea>
                        <p className="mt-2 text-xs text-neutral-500">
                            Available variables: {'{client_name}'}, {'{invoice_number}'}, {'{amount}'}, {'{due_date}'}, {'{company_name}'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            <Save size={18} />
                            Save Template
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailTemplateEditor;