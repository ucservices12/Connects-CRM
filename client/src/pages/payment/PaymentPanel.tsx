import React from 'react';
import { Plan } from '../../types/pricing';

interface PaymentPanelProps {
    selectedPlan: Plan | null;
    billingCycle: 'monthly' | 'yearly';
    onClose: () => void;
}

const PaymentPanel: React.FC<PaymentPanelProps> = ({ selectedPlan, billingCycle, onClose }) => {
    if (!selectedPlan) return null;

    // Calculate price based on billing cycle
    const basePrice = selectedPlan.price;
    const price = billingCycle === 'monthly'
        ? basePrice
        : Math.floor(basePrice * 12 * 0.8); // 20% discount yearly

    // Convert price to INR (if needed)
    const priceINR = price * 83;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                    aria-label="Close payment panel"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-semibold mb-2">{selectedPlan.name}</h2>
                <p className="text-gray-600 mb-4">{selectedPlan.description}</p>

                <p className="text-lg font-medium mb-4">
                    Price: ₹{priceINR.toLocaleString()} {billingCycle === 'monthly' ? '/ month' : '/ year'}
                </p>

                <div className="space-y-3">
                    <button className="w-full py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
                        Pay with Card
                    </button>
                    <button className="w-full py-2 rounded bg-green-500 text-white hover:bg-green-600 transition">
                        Pay with Google Pay
                    </button>
                    <button className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                        Pay with PhonePe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPanel;
