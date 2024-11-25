import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, Calendar, DollarSign, FileText, User, Briefcase, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import axiosInstance from "../../api/axiosInstance";

const CUSTOMERS = [
    { id: 1, name: 'Acme Corp', email: 'billing@acme.com' },
    { id: 2, name: 'Wayne Enterprises', email: 'accounts@wayne.com' },
    { id: 3, name: 'Stark Industries', email: 'billing@stark.com' },
];

const JOBS = [
    { id: 1, title: 'Website Redesign', rate: 150 },
    { id: 2, title: 'Mobile App Development', rate: 200 },
    { id: 3, title: 'SEO Optimization', rate: 100 },
    { id: 4, title: 'Cloud Migration', rate: 175 },
];

const STATUS_OPTIONS = ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'];
const PAYMENT_TERMS = ['Net 30', 'Net 15', 'Due on Receipt', 'Net 60'];

const InvoiceModal = ({ isOpen, onClose, invoiceId = null, initialData = null }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [jobs, setJobs] = useState([]);


    console.log(initialData);
    // console.log(invoiceId);
    // Form State
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        status: 'Draft',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        paymentTerms: 'Net 30',
        notes: '',
        taxRate: 0,
        discount: 0
    });


    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/job/jobs');
            setJobs(response.data);
        } catch (err) {
            setError('Failed to load jobs data');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchJobs();
        if (initialData) {
            setFormData({
                invoice_id: initialData.invoice_id || null,
                invoiceNumber: initialData.invoiceNumber,
                status: initialData.status,
                issueDate: initialData.issueDate,
                dueDate: initialData.dueDate,
                paymentTerms: initialData.paymentTerms,
                notes: initialData.notes,
                taxRate: initialData.taxRate || 0,
                discount: initialData.discount || 0,
                customerId: initialData.customer?.id || null
            });
            setLineItems(initialData.lineItems || []);
        } else if (invoiceId) {
            fetchInvoiceData();
        }
    }, [invoiceId, initialData]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [jobSearch, setJobSearch] = useState('');
    const [lineItems, setLineItems] = useState([]);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showJobDropdown, setShowJobDropdown] = useState(false);
    const [adhocItem, setAdhocItem] = useState({ description: '', rate: '', hours: '', type: 'service' });

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer); // Set the selected customer object
        setCustomerSearch(customer.name); // Display the selected customer's name
        setFormData((prevData) => ({
            ...prevData,
            customerId: customer.id, // Set only the customerId in the formData
        }));
        setShowCustomerDropdown(false);
    };

    const filteredCustomers = CUSTOMERS.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase())
    );

    const filteredJobs = jobs.filter(job =>
        job.notes.toLowerCase().includes(jobSearch.toLowerCase()) ||
        job.jobType.title.toLowerCase().includes(jobSearch.toLowerCase())
    );


    const removeLineItem = (index) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };
    // Fetch existing invoice data if editing
    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceData();
        }
    }, [invoiceId]);

    const fetchInvoiceData = async () => {
        try {

            setLoading(true);
            const response = await fetch(`/invoices/${invoiceId}`);
            if (!response.ok) throw new Error('Failed to fetch invoice');
            const data = await response.data();

            // Populate form with existing data
            setFormData({
                invoiceNumber: data.invoiceNumber,
                status: data.status,
                issueDate: data.issueDate,
                dueDate: data.dueDate,
                paymentTerms: data.paymentTerms,
                notes: data.notes,
                taxRate: data.taxRate || 0,
                discount: data.discount || 0,
                customerId: data.customer.id // Changed from customer to customerId
            });

            // Update the customer search field with the customer name
            const customer = CUSTOMERS.find(c => c.id === data.customerId);
            if (customer) {
                setCustomerSearch(customer.name);
            }
            setLineItems(data.lineItems);
        } catch (err) {
            setError('Failed to load invoice data');
        } finally {
            setLoading(false);
        }
    };

    const saveInvoice = async () => {
        try {
            setLoading(true);
            setError(null);

            const invoiceData = {
                invoice_id: formData.invoice_id || null,
                invoiceNumber: formData.invoiceNumber,
                status: formData.status,
                issueDate: formData.issueDate,
                dueDate: formData.dueDate,
                paymentTerms: formData.paymentTerms,
                notes: formData.notes,
                taxRate: formData.taxRate,
                discount: formData.discount,
                customerId: formData.customerId,
                lineItems: lineItems.map(item => ({
                    id: typeof item.id === 'string' ? 0 : item.id,
                    itemId: item.itemId, // Include itemId in the saved data
                    title: item.title,
                    rate: item.rate,
                    hours: item.hours,
                    type: item.type
                })),
                subtotal: calculateSubtotal(),
                taxAmount: calculateTax(),
                discountAmount: calculateDiscount(),
                total: calculateTotal(),
            };

            const requestBody = {
                invoice: invoiceData
            };

            const response = await axiosInstance[invoiceId ? 'put' : 'post'](
                invoiceId ? `/invoices/${invoiceId}` : '/invoices',
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.data();
                throw new Error(errorData.title || 'Failed to save invoice');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to save invoice');
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return lineItems.reduce((sum, item) => sum + (item.rate * item.hours), 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * (formData.taxRate / 100);
    };

    const calculateDiscount = () => {
        return calculateSubtotal() * (formData.discount / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() - calculateDiscount();
    };

    const addLineItem = (job) => {
        const newLineItem = {
            id: null,
            itemId: job.jobId, // Add the jobId as itemId
            jobId: job.jobId,
            title: 'Job #' + job.jobId,
            rate: job.amount / job.hours_worked,
            hours: job.hours_worked,
            type: 'Job',
            amount: job.amount
        };

        setLineItems([...lineItems, newLineItem]);
        setJobSearch('');
        setShowJobDropdown(false);
    };

    const addAdhocItem = () => {
        if (adhocItem.description && adhocItem.rate && adhocItem.hours) {
            setLineItems([...lineItems, {
                id: `${Date.now()}`,
                itemId: null, // Ad-hoc items don't have an itemId
                title: adhocItem.description,
                rate: parseFloat(adhocItem.rate),
                hours: parseFloat(adhocItem.hours),
                type: adhocItem.type
            }]);
            setAdhocItem({ description: '', rate: '', hours: '', type: 'service', itemId: null });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {invoiceId ? 'Edit Invoice' : 'Create Invoice'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {invoiceId ? `Editing invoice #${formData.invoiceNumber}` : 'Create a new invoice'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Main Form */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Left Column - Invoice Details */}
                        <div className="col-span-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Invoice Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md"
                                    value={formData.invoiceNumber}
                                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                                    placeholder="INV-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full p-2 border rounded-md bg-white"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Issue Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md"
                                    value={formData.issueDate}
                                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Terms
                                </label>
                                <select
                                    className="w-full p-2 border rounded-md bg-white"
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                                >
                                    {PAYMENT_TERMS.map(term => (
                                        <option key={term} value={term}>{term}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Middle Column - Customer & Notes */}
                        <div className="col-span-1 space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Search customers..."
                                        value={customerSearch}
                                        onChange={(e) => {
                                            setCustomerSearch(e.target.value);
                                            setShowCustomerDropdown(true);
                                        }}
                                        onFocus={() => setShowCustomerDropdown(true)}
                                    />
                                    {showCustomerDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                            {filteredCustomers.map(customer => (
                                                <div
                                                    key={customer.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCustomer(customer);
                                                        setCustomerSearch(customer.name);
                                                        setShowCustomerDropdown(false);
                                                    }}
                                                >
                                                    <div className="font-medium">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">{customer.email}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-md h-32"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    placeholder="Add any notes or special instructions..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.taxRate}
                                        onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary */}
                        <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-lg mb-4">Invoice Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax ({formData.taxRate}%):</span>
                                    <span>${calculateTax().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount ({formData.discount}%):</span>
                                    <span>-${calculateDiscount().toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Section */}
                    <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Line Items</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="p-2 border rounded-md w-64"
                                    placeholder="Search jobs..."
                                    value={jobSearch}
                                    onChange={(e) => {
                                        setJobSearch(e.target.value);
                                        setShowJobDropdown(true);
                                    }}
                                    onFocus={() => setShowJobDropdown(true)}
                                />
                                {showJobDropdown && filteredJobs.length > 0 && (
                                    <div
                                        className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                        {filteredJobs.map(job => (
                                            <div
                                                key={job.jobId}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => addLineItem(job)}
                                            >
                                                <div className="font-medium">Job #{job.jobId}</div>
                                                <div className="text-sm text-gray-500">
                                                    ${job.amount} - {job.hours_worked} hours - {job.jobType.title}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Rate</th>
                                    <th className="px-4 py-2 text-left">Hours/Qty</th>
                                    <th className="px-4 py-2 text-left">Total</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {lineItems.map((item, index) => (
                                    <tr key={index} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                className="w-full p-1 border rounded hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newLineItems = [...lineItems];
                                                    newLineItems[index].title = e.target.value;
                                                    setLineItems(newLineItems);
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <select
                                                className="w-full p-1 border rounded hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={item.type}
                                                onChange={(e) => {
                                                    const newLineItems = [...lineItems];
                                                    newLineItems[index].type = e.target.value;
                                                    setLineItems(newLineItems);
                                                }}
                                            >
                                                <option value="service">Service</option>
                                                <option value="product">Product</option>
                                                <option value="expense">Expense</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-1">$</span>
                                                <input
                                                    type="number"
                                                    className="w-24 p-1 border rounded hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    value={item.rate}
                                                    onChange={(e) => {
                                                        const newLineItems = [...lineItems];
                                                        newLineItems[index].rate = parseFloat(e.target.value) || 0;
                                                        setLineItems(newLineItems);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                className="w-20 p-1 border rounded hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                value={item.hours}
                                                onChange={(e) => {
                                                    const newLineItems = [...lineItems];
                                                    newLineItems[index].hours = parseFloat(e.target.value) || 0;
                                                    setLineItems(newLineItems);
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-2 font-medium">
                                            ${(item.rate * item.hours).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => removeLineItem(index)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Ad-hoc Item Form */}
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                                <Plus size={16} className="mr-1" />
                                Add Ad-hoc Item
                            </h4>
                            <div className="grid grid-cols-5 gap-4">
                                <input
                                    type="text"
                                    className="p-2 border rounded-md col-span-2"
                                    placeholder="Description"
                                    value={adhocItem.description}
                                    onChange={(e) => setAdhocItem({ ...adhocItem, description: e.target.value })}
                                />
                                <select
                                    className="p-2 border rounded-md"
                                    value={adhocItem.type}
                                    onChange={(e) => setAdhocItem({ ...adhocItem, type: e.target.value })}
                                >
                                    <option value="service">Service</option>
                                    <option value="product">Product</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <div className="relative">
                                    <span className="absolute left-2 top-2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        className="p-2 pl-6 border rounded-md w-full"
                                        placeholder="Rate"
                                        value={adhocItem.rate}
                                        onChange={(e) => setAdhocItem({ ...adhocItem, rate: e.target.value })}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        className="p-2 border rounded-md w-24"
                                        placeholder="Hours"
                                        value={adhocItem.hours}
                                        onChange={(e) => setAdhocItem({ ...adhocItem, hours: e.target.value })}
                                    />
                                    <button
                                        onClick={addAdhocItem}
                                        disabled={!adhocItem.description || !adhocItem.rate || !adhocItem.hours}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-grow"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 text-green-800 border-green-200">
                            <AlertDescription>Invoice saved successfully!</AlertDescription>
                        </Alert>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveInvoice}
                            disabled={loading || !selectedCustomer || lineItems.length === 0}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin">⌛</span>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FileText size={16} />
                                    <span>Save Invoice</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;