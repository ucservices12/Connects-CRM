import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Filter, PlusCircle, Download, Eye, Edit,
    Trash2, CheckCircle, AlertTriangle, Clock, FileText,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import LoadingScreen from '../../components/common/LoadingScreen';
import { deleteInvoice, getInvoices } from '../../machine/invoice';
import { useAuth } from '../../contexts/AuthContext';
import {
    Chip,
    Typography,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack,
    Pagination
} from '@mui/material';
import { toast } from '../../components/common/Toaster';

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'paid':
            return (
                <Chip
                    icon={<CheckCircle size={16} color='#00c853' />}
                    label="Paid"
                    sx={{
                        backgroundColor: '#E6F4EA',
                        color: '#00c853',
                        paddingX: 1.5,
                        paddingY: 0.5,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                    }}
                    size="small"
                />
            );
        case 'sent':
            return (
                <Chip
                    icon={<Clock size={16} color='#1565C0' />}
                    label="Sent"
                    sx={{
                        backgroundColor: '#E3F2FD',
                        color: '#1565C0',
                        paddingX: 1.5,
                        paddingY: 0.5,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                    }}
                    size="small"
                />
            );
        case 'overdue':
            return (
                <Chip
                    icon={<AlertTriangle size={16} color='#f44336' />}
                    label="Overdue"
                    sx={{
                        backgroundColor: '#FFEBEE',
                        color: '#f44336',
                        paddingX: 1.5,
                        paddingY: 0.5,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                    }}
                    size="small"
                />
            );
        default:
            return (
                <Chip
                    icon={<FileText size={16} />}
                    label="Draft"
                    sx={{
                        backgroundColor: '#ECEFF1',
                        color: '#37474F',
                        paddingX: 1.5,
                        paddingY: 0.5,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                    }}
                    size="small"
                />
            );
    }
};

const InvoiceList = () => {
    const { organization } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await getInvoices(currentPage, itemsPerPage, organization._id);
                if (response.success === true) {
                    setInvoices(response?.data);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // Filter invoices based on search term and status filter
    const filteredInvoices = invoices.filter(invoice => {
        const invoiceNo = invoice?.invoiceNo || '';
        const companyName = invoice?.client?.companyName || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            invoiceNo.toLowerCase().includes(search) ||
            companyName.toLowerCase().includes(search);

        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_: any, page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteInvoice(id);
            setInvoices(prev => prev.filter(inv => inv._id !== id));
            toast.success('Invoice deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete invoice');
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h5">
                    Invoices
                </Typography>
                <Link to="/invoices/create" className="btn-primary">
                    <PlusCircle size={18} />
                    Create Invoice
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4 rounded-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Search by invoice number or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} className="text-neutral-400" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Statuses</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="sent">Sent</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="overdue">Overdue</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                            startIcon={<Download size={18} />}
                            sx={{ height: 40 }}
                        >
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Responsive Invoice List */}
            <div className="overflow-hidden card p-0 rounded-none">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#616161] text-white text-sm font-normal border-b border-neutral-200">
                                <th className="py-3 px-4 text-left">Invoice #</th>
                                <th className="py-3 px-4 text-left">Client</th>
                                <th className="py-3 px-4 text-left">Issue Date</th>
                                <th className="py-3 px-4 text-left">Due Date</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {paginatedInvoices.map((invoice, index) => (
                                <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                                    <td className="p-2">
                                        <Link
                                            to={`/invoices/${invoice?._id}`}
                                            className="text-primary-600 hover:underline"
                                        >
                                            {invoice?.invoiceNo}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{invoice?.client?.companyName}</div>
                                        <div className="text-sm text-neutral-500">{invoice?.client?.name}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(invoice?.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(invoice?.dueDate).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="py-3 px-4 text-right font-medium">
                                        ₹{invoice?.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {getStatusBadge(invoice?.status)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/invoices/${invoice?.invoiceNo}`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/invoices/${invoice?._id}/edit`}
                                                className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(invoice?._id)}
                                                className="p-1 text-neutral-500 hover:text-danger-600 hover:bg-neutral-100 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                                        No invoices found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden flex flex-col gap-4 p-4">
                    {paginatedInvoices.length === 0 && (
                        <div className="text-center text-neutral-500 py-8">
                            No invoices found matching your criteria
                        </div>
                    )}
                    {paginatedInvoices.map((invoice, index) => (
                        <div key={index} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold text-primary-700">
                                    <Link to={`/invoices/${invoice?._id}`}>{invoice?.invoiceNo}</Link>
                                </div>
                                <div>{getStatusBadge(invoice.status)}</div>
                            </div>
                            <div className="text-sm text-neutral-700">{invoice?.client.companyName}</div>
                            <div className="text-xs text-neutral-500">{invoice?.client?.name}</div>
                            <div className="flex justify-between text-xs mt-2">
                                <span>Issue: {new Date(invoice?.createdAt).toLocaleDateString('en-IN')}</span>
                                <span>Due: {new Date(invoice?.dueDate).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-medium text-lg text-green-700">
                                    ₹{invoice?.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/invoices/${invoice?.invoiceNo}`}
                                        className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/invoices/${invoice?._id}/edit`}
                                        className="p-1 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(invoice?._id)}
                                        className="p-1 text-neutral-500 hover:text-danger-600 hover:bg-neutral-100 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {filteredInvoices.length > 0 && (
                    <div className="py-4 px-6 flex flex-col md:flex-row justify-between items-center border-t border-neutral-200 gap-2">
                        <div className="text-sm text-neutral-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                        </div>
                        <Stack spacing={2} direction="row">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    </div>
                )}
            </div>
        </>
    );
};

export default InvoiceList;