import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import axiosInstance from "../../api/axiosInstance";

const InvoiceModal = ({ isOpen, invoice, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        invoice_date: new Date().toISOString().split('T')[0],
        customerid: invoice ? invoice.customerid : null,  // Check if invoice is defined first
        total_amount: invoice ? invoice.total_amount : null,  // Same check here
        invoice_id: invoice ? invoice.invoice_id : null  // Same check here
    });

    const [customerDetails, setCustomerDetails] = useState(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerSearchResults, setCustomerSearchResults] = useState([]);
    const [adhocEntries, setAdhocEntries] = useState([]);
    const [jobSearch, setJobSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (invoice) {
            setAdhocEntries(invoice.adhoc);
            setSelectedJobs(invoice.jobs);
            // let invoice.customer.name = invoice.customer.firstName + ' ' + invoice.customer.lastName;
            setCustomerDetails(invoice.customer)
            setFormData({
                invoice_date: invoice.invoice_date,
                customerid: invoice.customerid,
                total_amount: invoice.total_amount
            });
            if (invoice.items) {
                const jobs = invoice.items.filter(item => item.JobId);
                const adhoc = invoice.items.filter(item => !item.JobId);
                setSelectedJobs(jobs);
                setAdhocEntries(adhoc);
            }
        }
    }, [invoice]);

    console.log(customerDetails);
    const handleCustomerSearch = async (query) => {
        setCustomerSearch(query);
        if (query.length < 2) {
            setCustomerSearchResults([]);
            return;
        }

        try {
            const response = await axiosInstance.get(`/customer/search?searchTerm=${query}`);
            if (response.data) {
                setCustomerSearchResults(response.data);
            }
        } catch (error) {
            console.error('Error searching customers:', error);
            setCustomerSearchResults([]);
        }
    };

    const handleSelectCustomer = (customer) => {
        setFormData({ ...formData, customerid: customer.id });
        setCustomerDetails(customer);
        setCustomerSearch('');
        setCustomerSearchResults([]);
    };

    const handleAddAdhocEntry = () => {
        setAdhocEntries([
            ...adhocEntries,
            { Description: '', Amount: 0, Type: 'adhoc' }
        ]);
    };

    const handleAdhocChange = (index, field, value) => {
        const updated = [...adhocEntries];
        updated[index][field] = value;
        setAdhocEntries(updated);
    };

    const handleRemoveAdhocEntry = (index) => {
        setAdhocEntries(adhocEntries.filter((_, i) => i !== index));
    };

    const handleSearchJobs = async (query) => {
        setJobSearch(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.get(`/job/search?searchTerm=${query}`);
            if (response.data) {
                // Map the API response to match our expected format
                const formattedResults = response.data.map(job => ({
                    ...job,
                    JobId: job.jobId, // Create uppercase version for consistency
                    Amount: job.amount || 0, // Ensure Amount exists
                }));

                // Filter out already selected jobs
                const filteredResults = formattedResults.filter(job =>
                    !selectedJobs.some(selectedJob => selectedJob.JobId === job.JobId)
                );

                console.log('Formatted results:', formattedResults); // Debug log
                setSearchResults(filteredResults);
            }
        } catch (error) {
            console.error('Error searching jobs:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectJob = (job) => {
        setSelectedJobs(prevJobs => {
            const isJobSelected = prevJobs.some(selectedJob => selectedJob.JobId === job.JobId);
            if (!isJobSelected) {
                const formattedJob = {
                    ...job,
                    JobId: job.jobId, // Ensure consistent casing
                    Amount: job.amount || 10,
                    Type: 'job',
                    hours_worked: job.hours_worked,
                    notes: job.notes || ''
                };
                return [...prevJobs, formattedJob];
            }
            return prevJobs;
        });

        if (jobSearch.length >= 2) {
            handleSearchJobs(jobSearch);
        }
    };

    const handleJobHoursChange = (JobId, value) => {
        setSelectedJobs(prevJobs =>
            prevJobs.map(job =>
                job.JobId === JobId
                    ? { ...job, hours_worked: parseFloat(value) || 0 }
                    : job
            )
        );
    };

    useEffect(() => {
        console.log('Selected Jobs:', selectedJobs);
    }, [selectedJobs]);

    useEffect(() => {
        console.log('Search Results:', searchResults);
    }, [searchResults]);

    const handleRemoveJob = (JobId) => {
        setSelectedJobs(prevJobs => prevJobs.filter(job => job.JobId !== JobId));
    };

    const calculateTotal = () => {
        const jobsTotal = selectedJobs.reduce((sum, job) => sum + job.Amount, 0);
        const adhocTotal = adhocEntries.reduce((sum, entry) => sum + (parseFloat(entry.Amount) || 0), 0);
        return jobsTotal + adhocTotal;
    };

    const handleSave = async () => {
        const total = calculateTotal();
        const invoiceData = {
            ...formData,
            total_amount: total,
            items: [
                ...selectedJobs.map(job => ({
                    type: 'job',
                    jobId: job.jobId,
                    amount: job.Amount,
                    notes: job.notes,
                    hours_worked: job.hours_worked // Include HoursWorked in the invoice data
                })),
                ...adhocEntries.map(entry => ({
                    type: 'adhoc',
                    amount: parseFloat(entry.Amount) || 0,
                    notes: entry.notes
                }))
            ]
        };

        try {
            setLoading(true);
            let response;

            if (invoice?.id) {
                // Update existing invoice
                response = await axiosInstance.put(`/invoices/update/${invoice.id}`, invoiceData);
            } else {
                // Create new invoice
                response = await axiosInstance.post('/invoices/create', invoiceData);
            }

            if (response.data) {
                // Call the parent component's onSave with the response data
                await onSave(response.data);
                onClose();
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            alert('Failed to save invoice. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {invoice ? 'Edit Invoice '  : 'Create New Invoice'}
                        {invoice ? invoice.invoice_id : null}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Invoice Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.invoice_date}
                            onChange={e => setFormData({...formData, invoice_date: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Customer Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Search customers..."
                                value={customerSearch}
                                onChange={e => handleCustomerSearch(e.target.value)}
                            />
                            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            {customerSearchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                                    {customerSearchResults.map(customer => (
                                        <div
                                            key={customer.id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSelectCustomer(customer)}
                                        >
                                            {customer.name} - {customer.email}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {customerDetails && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p>Customer: {customerDetails.name || customerDetails.firstName + ' ' + customerDetails.lastName}</p>
                        <p>Email: {customerDetails.email}</p>
                    </div>
                )}

                {/* Jobs section */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Jobs</label>
                        <div className="relative w-64">
                            <input
                                className="w-full px-3 py-2 border rounded-md pr-10"
                                placeholder="Search and add multiple jobs..."
                                value={jobSearch}
                                onChange={e => handleSearchJobs(e.target.value)}
                            />
                            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400"/>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mb-4 border rounded-md shadow-lg bg-white max-h-48 overflow-y-auto">
                            {searchResults.map(job => (
                                <div
                                    key={job.jobId}
                                    className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => handleSelectJob(job)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{job.notes}</span>
                                        <span className="text-sm text-gray-600">${job.amount || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {jobSearch.length >= 2 && searchResults.length === 0 && !loading && (
                        <div className="mb-4 p-2 text-gray-500 text-sm">
                            No additional jobs found
                        </div>
                    )}

                    {loading && (
                        <div className="mb-4 p-2 text-gray-500 text-sm">
                            Searching...
                        </div>
                    )}

                    {/* Selected Jobs List */}
                    <div className="space-y-2 mt-2">
                        {selectedJobs.map(job => (
                            <div key={job.JobId}
                                 className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                                <div className="flex-1">
                                    <div>{job.notes}</div>
                                    <div className="text-sm text-gray-600">
                                        <input
                                            type="number"
                                            className="w-24 px-2 py-1 border rounded-md mr-2"
                                            placeholder="Hours"
                                            value={job.hours_worked || ''}
                                            onChange={e => handleJobHoursChange(job.JobId, e.target.value)}
                                        />
                                        hrs @ ${job.Amount}/hr
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">${job.amount}</span>
                                    <button
                                        onClick={() => handleRemoveJob(job.JobId)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ad Hoc Entries section */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Ad Hoc Entries</label>
                        <button
                            onClick={handleAddAdhocEntry}
                            className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-50"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Add Entry
                        </button>
                    </div>

                    <div className="space-y-2">
                        {adhocEntries.map((entry, index) => (
                            <div key={index} className="flex gap-4 items-center">
                                <input
                                    className="flex-grow px-3 py-2 border rounded-md"
                                    placeholder="Description"
                                    value={entry.description}
                                    onChange={e => handleAdhocChange(index, 'notes', e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="w-32 px-3 py-2 border rounded-md"
                                    placeholder="Amount"
                                    value={entry.Amount}
                                    onChange={e => handleAdhocChange(index, 'Amount', e.target.value)}
                                />
                                <button
                                    onClick={() => handleRemoveAdhocEntry(index)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Invoice'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;