import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface InvoiceMetricCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    change: number;
    changeType: 'increase' | 'decrease';
}

const InvoiceMetricCard: React.FC<InvoiceMetricCardProps> = ({
    title,
    value,
    icon,
    change,
    changeType
}) => {
    return (
        <div className="card p-5 border border-neutral-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-neutral-500 text-sm mb-1">{title}</p>
                    <h3 className="text-2xl font-medium">{value}</h3>
                </div>
                <div className="p-2 rounded-lg bg-neutral-100">
                    {icon}
                </div>
            </div>

            <div className="mt-4 flex items-center">
                {changeType === 'increase' ? (
                    <ArrowUp size={16} className="text-success-600 mr-1" />
                ) : (
                    <ArrowDown size={16} className="text-danger-600 mr-1" />
                )}

                <span
                    className={`text-sm font-medium ${changeType === 'increase'
                            ? 'text-success-600'
                            : 'text-danger-600'
                        }`}
                >
                    {Math.abs(change)}%
                </span>

                <span className="text-neutral-500 text-sm ml-1">vs last month</span>
            </div>
        </div>
    );
};

export default InvoiceMetricCard;