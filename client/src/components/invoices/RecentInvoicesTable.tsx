import { Link } from 'react-router-dom';
import { Eye, ExternalLink } from 'lucide-react';

const RecentInvoicesTable = () => {
    // Sample data - in a real app, this would come from an API
    const recentInvoices = [
        {
            id: 'INV-2025-001',
            client: 'Acme Corporation',
            amount: 2500.00,
            date: '2025-03-15',
            status: 'paid',
            clientId: '1'
        },
        {
            id: 'INV-2025-002',
            client: 'Globex Industries',
            amount: 1899.50,
            date: '2025-03-18',
            status: 'pending',
            clientId: '2'
        },
        {
            id: 'INV-2025-003',
            client: 'Stark Enterprises',
            amount: 3750.00,
            date: '2025-03-10',
            status: 'overdue',
            clientId: '3'
        },
        {
            id: 'INV-2025-004',
            client: 'Wayne Industries',
            amount: 1250.75,
            date: '2025-03-20',
            status: 'paid',
            clientId: '4'
        },
        {
            id: 'INV-2025-005',
            client: 'Umbrella Corp',
            amount: 4200.00,
            date: '2025-03-22',
            status: 'draft',
            clientId: '5'
        }
    ];

    // Function to determine badge color based on status
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'paid':
                return 'badge-success';
            case 'pending':
                return 'badge-warning';
            case 'overdue':
                return 'badge-danger';
            default:
                return 'badge-neutral';
        }
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recentInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.id}</td>
                            <td>
                                <Link
                                    to={`/invoices/client/${invoice.clientId}`}
                                    className="text-primary-600 hover:underline flex items-center"
                                >
                                    {invoice.client}
                                    <ExternalLink size={14} className="ml-1" />
                                </Link>
                            </td>
                            <td>
                                ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td>{new Date(invoice.date).toLocaleDateString()}</td>
                            <td>
                                <span className={getStatusBadgeClass(invoice.status)}>
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                            </td>
                            <td>
                                <Link
                                    to={`/invoices/${invoice.id}`}
                                    className="btn-outline py-1 px-2"
                                >
                                    <Eye size={16} />
                                    <span className="sr-only">View</span>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentInvoicesTable;