import React, { useState, useEffect } from 'react';
import {
    Search, Edit, Trash2, Plus, ArrowUpDown,
    AlertCircle, CheckCircle2
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import InvoiceModal from './InvoiceModal';
import axiosInstance from "../../api/axiosInstance";

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('invoiceNumber');
    const [sortDirection, setSortDirection] = useState('asc');
    // const [modalOpen, setModalOpen] = useState(false);

    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Fetch invoices
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/invoices/invoices');
            // Axios automatically throws on non-2xx responses, and data is in response.data
            setInvoices(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load invoices');
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Handle sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleEditInvoice = (invoice) => {
        console.log(invoice.invoice_id);
        // Format the invoice data to match the modal's expected structure
        const formattedInvoice = {
            invoice_id: invoice.invoice_id,
            invoiceNumber: `INV-${invoice.invoice_id}`,
            status: invoice.status,
            issueDate: new Date(invoice.created_at).toISOString().split('T')[0],
            dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
            paymentTerms: invoice.paymentTerms,
            notes: invoice.notes,
            taxRate: invoice.taxRate,
            discount: invoice.discount,
            customer: {
                id: invoice.customer.id,
                name: `${invoice.customer.firstName} ${invoice.customer.lastName}`,
                email: invoice.customer.email
            },
            lineItems: invoice.lineItems.map(item => ({
                id: item.id,
                title: item.title,
                rate: item.rate,
                hours: item.hours,
                type: item.type.toLowerCase()
            }))
        };

        setSelectedInvoice(formattedInvoice);
        setIsModalOpen(true);
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;

        try {
            await axiosInstance.delete(`/invoices/${id}`);
            setSuccess('Invoice deleted successfully');
            fetchInvoices();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete invoice');
            setTimeout(() => setError(null), 3000);
        }
    };

    // Filter and sort invoices
    const filteredAndSortedInvoices = invoices
        .filter(invoice =>
            invoice.invoice_id?.toString().includes(searchTerm.toLowerCase()) ||
            `${invoice.customer?.firstName} ${invoice.customer?.lastName}`?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.status?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;
            if (sortField === 'total') {
                comparison = (a[sortField] || 0) - (b[sortField] || 0);
            } else if (sortField === 'customer.name') {
                const aName = `${a.customer?.firstName} ${a.customer?.lastName}`;
                const bName = `${b.customer?.firstName} ${b.customer?.lastName}`;
                comparison = aName.localeCompare(bName);
            } else {
                comparison = String(a[sortField] || '').localeCompare(String(b[sortField] || ''));
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

    // Status badge styles
    const getStatusBadgeStyle = (status) => {
        const baseStyle = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status?.toLowerCase()) {
            case 'paid':
                return `${baseStyle} bg-green-100 text-green-800`;
            case 'pending':
                return `${baseStyle} bg-yellow-100 text-yellow-800`;
            case 'overdue':
                return `${baseStyle} bg-red-100 text-red-800`;
            case 'draft':
                return `${baseStyle} bg-gray-100 text-gray-800`;
            default:
                return `${baseStyle} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                <button
                    onClick={() => {
                        setSelectedInvoice(null);

                    }}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus size={20} />
                    <span>New Invoice</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('invoice_id')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Invoice #</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('customer.name')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Customer</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('created_at')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Date</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('total')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Total</span>
                                    <ArrowUpDown size={14} />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Loading invoices...
                                </td>
                            </tr>
                        ) : filteredAndSortedInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No invoices found
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedInvoices.map((invoice) => (
                                <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {invoice.invoice_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {`${invoice.customer?.firstName} ${invoice.customer?.lastName}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(invoice.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getStatusBadgeStyle(invoice.status)}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${invoice.total?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditInvoice(invoice)}
                                                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                            >
                                                <Edit size={16}/>
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.invoice_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>


            <InvoiceModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedInvoice(null);
                }}
                invoiceId={selectedInvoice?.invoice_id}
                initialData={selectedInvoice}
            />
        </div>
    );
};

export default InvoiceTable;