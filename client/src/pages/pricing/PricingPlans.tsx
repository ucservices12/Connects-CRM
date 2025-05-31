import React, { useState } from 'react';
import PlanCard from './PlanCard';
import { plans } from '../../data/pricingPlans';
import { PublicNavbar } from '../../layouts/AuthLayout';
import PaymentPanel from '../payment/PaymentPanel';

const PricingPlans: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);

    const selectedPlan = plans.find(plan => plan.id === selectedPlanId) || null;

    // When user clicks on plan's subscribe button
    const handleSelectPlan = (planId: string) => {
        setSelectedPlanId(planId);
        setShowPayment(true);
    };

    return (
        <>
            <div className="py-4 sm:px-4">
                <PublicNavbar />
            </div>

            <div className="max-w-6xl py-4 mx-4 sm:mx-auto">
                {/* Billing toggle */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            Yearly <span className="text-indigo-600 font-medium ml-1">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Plans grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            billingCycle={billingCycle}
                            isPopular={plan.id === 'pro'}
                            isSelected={selectedPlanId === plan.id}
                            setSelectedPlanId={handleSelectPlan}
                        />
                    ))}
                </div>
            </div>

            {/* Payment Panel Modal */}
            {showPayment && selectedPlan && (
                <PaymentPanel
                    selectedPlan={selectedPlan}
                    billingCycle={billingCycle}
                    onClose={() => setShowPayment(false)}
                />
            )}
        </>
    );
};

export default PricingPlans;
