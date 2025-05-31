import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { Plan } from './types'; // adjust path if needed

interface PlanCardProps {
    plan: Plan;
    isPopular: boolean;
    billingCycle: 'monthly' | 'yearly';
    selectedPlanId: string;
    setSelectedPlanId: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    isSelected,
    isPopular,
    billingCycle,
    selectedPlanId,
    setSelectedPlanId
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const price = billingCycle === 'yearly'
        ? Math.floor(plan.price * 12 * 0.8)
        : plan.price;

    const priceInINR = price * 83;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    useEffect(() => {
        if (selectedPlanId === plan.id && cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedPlanId, plan.id]);

    return (
        <div
            ref={cardRef}
            onClick={() => {
                setSelectedPlanId(plan.id);
                console.log('Selected Plan Data:', plan);
            }}
            className={`
                rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer text-sm
                ${selectedPlanId === plan.id
                    ? 'scale-105 shadow-2xl border-2 border-indigo-600 z-20'
                    : isPopular
                        ? 'shadow-xl border-2 border-indigo-500 scale-[1.02] relative z-10'
                        : 'shadow-lg border border-gray-200 hover:shadow-xl hover:scale-[1.01]'
                }
            `}
        >
            {(isPopular && selectedPlanId !== plan.id) && (
                <div className="bg-indigo-500 text-white text-center py-1 text-xs font-semibold">
                    MOST POPULAR
                </div>
            )}

            <div className="bg-white p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="mb-5">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">₹{priceInINR.toLocaleString()}</span>
                        <span className="text-gray-600 ml-1 text-xs">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {billingCycle === 'monthly'
                            ? 'Billed monthly'
                            : `Save ₹${(plan.price * 12 * 0.2 * 83).toFixed(0)} with annual billing`}
                    </p>
                </div>

                <div className="space-y-2 mb-5 text-sm">
                    <div className="flex items-center">
                        <span className="text-indigo-600 font-medium">Up to {plan.maxEmployees} employees</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-indigo-600 font-medium">{plan.maxStorage} GB storage</span>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand();
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-600 font-medium mb-3 hover:text-indigo-800 transition-colors"
                >
                    <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                    {isExpanded ? 'Hide modules' : 'Show modules'}
                </button>

                <div className={`
                    border-t border-gray-100 pt-3 space-y-2 transition-all duration-300 overflow-hidden text-sm
                    ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <h4 className="font-semibold text-gray-900 text-sm">Included modules:</h4>
                    {Object.entries(plan.modules).map(([module, isIncluded]) => (
                        <div key={module} className="flex items-center">
                            {isIncluded ? (
                                <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            ) : (
                                <XIcon className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />
                            )}
                            <span className={isIncluded ? 'text-gray-800' : 'text-gray-400'}>
                                {moduleLabels[module]}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanId(plan.id);
                        }}
                        className={`px-4 py-2 rounded-md font-medium ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {plan.id === 'free' ? 'Get started' : 'Subscribe now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const moduleLabels: Record<string, string> = {
    crm: 'CRM & Customer Management',
    attendance: 'Attendance Tracking',
    leaves: 'Leave Management',
    assets: 'Asset Management',
    tasks: 'Task Tracking',
    reports: 'Advanced Reports & Analytics'
};

export default PlanCard;
