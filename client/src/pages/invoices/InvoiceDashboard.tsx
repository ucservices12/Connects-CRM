import { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, Clock, CheckCircle, AlertTriangle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvoiceStatusChart from '../../components/invoices/InvoiceStatusChart';
import RecentInvoicesTable from '../../components/invoices/RecentInvoicesTable';
import InvoiceMetricCard from '../../components/invoices/InvoiceMetricCard';
import LoadingScreen from '../../components/common/LoadingScreen';

function InvoiceDashboard() {
    const [metrics, setMetrics] = useState({
        totalAmount: 0,
        pending: 0,
        paid: 0,
        overdue: 0,
        averagePaymentTime: 0
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setMetrics({
                totalAmount: 45750.80,
                pending: 12,
                paid: 38,
                overdue: 5,
                averagePaymentTime: 8.5
            });
            setIsLoading(false);
        }, 800);
    }, []);

    const formatRupees = (amount: number) =>
        `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="w-full max-w-full px-2 sm:px-4 mx-auto overflow-x-hidden">
            <div className="flex justify-between items-center mb-6 gap-3">
                <h1 className="text-2xl font-medium">Invoice Dashboard</h1>
                <Link to="/invoices/create" className="btn-primary flex items-center gap-2">
                    <PlusCircle size={18} />
                    Create Invoice
                </Link>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">
                <InvoiceMetricCard
                    title="Total Outstanding"
                    value={formatRupees(metrics.totalAmount)}
                    icon={<DollarSign className="text-primary-600" />}
                    change={5.8}
                    changeType="increase"
                />
                <InvoiceMetricCard
                    title="Pending Invoices"
                    value={metrics.pending.toString()}
                    icon={<Clock className="text-warning-600" />}
                    change={-2}
                    changeType="decrease"
                />
                <InvoiceMetricCard
                    title="Paid Invoices"
                    value={metrics.paid.toString()}
                    icon={<CheckCircle className="text-success-600" />}
                    change={12}
                    changeType="increase"
                />
                <InvoiceMetricCard
                    title="Overdue Invoices"
                    value={metrics.overdue.toString()}
                    icon={<AlertTriangle className="text-danger-600" />}
                    change={1}
                    changeType="increase"
                />
            </div>

            {/* Charts and Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                <div className="lg:col-span-1 card w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Invoice Status</h2>
                        <BarChart2 size={20} className="text-neutral-500" />
                    </div>
                    <InvoiceStatusChart />
                </div>
                <div className="lg:col-span-2 card w-full overflow-x-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Recent Invoices</h2>
                        <Link to="/invoices/list" className="text-primary-600 text-sm hover:underline">
                            View All
                        </Link>
                    </div>
                    <RecentInvoicesTable />
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8 w-full">
                <Link
                    to="/invoices/overdue"
                    className="card card-hover p-4 bg-danger-50 border border-danger-100 flex items-center gap-4"
                >
                    <div className="p-3 rounded-full bg-danger-100">
                        <AlertTriangle size={24} className="text-danger-600" />
                    </div>
                    <div>
                        <h3 className="font-medium">Overdue Invoices</h3>
                        <p className="text-sm text-neutral-600">Handle past-due payments</p>
                    </div>
                </Link>
                <Link
                    to="/invoices/recurring"
                    className="card card-hover p-4 bg-primary-50 border border-primary-100 flex items-center gap-4"
                >
                    <div className="p-3 rounded-full bg-primary-100">
                        <Clock size={24} className="text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-medium">Recurring Invoices</h3>
                        <p className="text-sm text-neutral-600">Manage automatic billing</p>
                    </div>
                </Link>
                <Link
                    to="/invoices/settings"
                    className="card card-hover p-4 bg-neutral-50 border border-neutral-100 flex items-center gap-4"
                >
                    <div className="p-3 rounded-full bg-neutral-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium">Invoice Settings</h3>
                        <p className="text-sm text-neutral-600">Customize invoice details</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default InvoiceDashboard;