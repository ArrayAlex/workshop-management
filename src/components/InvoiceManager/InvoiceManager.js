import React, { useState, useEffect } from 'react';
import axiosInstance from "../../api/axiosInstance";
import InvoiceModal from "./InvoiceModal";

const InvoiceManager = () => {
    const [invoices, setInvoices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axiosInstance.get('/invoices/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const openModal = (invoice = null) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
        setIsModalOpen(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Invoices</h1>
            <button
                onClick={() => openModal()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Create New Invoice
            </button>
            <table className="min-w-full bg-white rounded-lg mt-4">
                <thead>
                <tr>
                    <th className="text-left px-4 py-2">Invoice #</th>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">Payment Status</th>
                    <th className="text-left px-4 py-2">Total</th>
                    <th className="text-left px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.invoiceID} className="hover:bg-gray-100">
                        <td className="px-4 py-2">{invoice.invoice_id}</td>
                        <td className="px-4 py-2">{invoice.invoice_date}</td>
                        <td className="px-4 py-2">{invoice.payment_status || 'N/A'}</td>
                        <td className="px-4 py-2">
                            ${invoice.totalAmount ? invoice.totalAmount.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                            <button
                                onClick={() => openModal(invoice)}
                                className="text-blue-500 hover:underline"
                            >
                                View/Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isModalOpen && (
                <InvoiceModal
                    isOpen={isModalOpen}
                    invoice={selectedInvoice}
                    onClose={closeModal}
                    onSave={fetchInvoices}
                />
            )}
        </div>
    );
};

export default InvoiceManager;
