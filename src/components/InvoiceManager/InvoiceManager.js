import React, { useState, useEffect, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceModal from '../InvoiceModal/InvoiceModal';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { Search, Edit, FileDownload } from '@mui/icons-material';
import './InvoiceManager.css';
import InvoicePDF from '../InvoicePDF/InvoicePDF';

const InvoiceManager = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

    useEffect(() => {
        setInvoices(fakeInvoices);
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice =>
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [invoices, searchTerm]);

    const sortedInvoices = useMemo(() => {
        return [...filteredInvoices].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredInvoices, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const openModal = (invoice = null) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
        setIsModalOpen(false);
    };

    const handleSaveInvoice = (newInvoice) => {
        setInvoices(prevInvoices => {
            if (selectedInvoice) {
                // Update existing invoice
                return prevInvoices.map(inv => 
                    inv.id === newInvoice.id ? newInvoice : inv
                );
            } else {
                // Add new invoice
                return [...prevInvoices, newInvoice];
            }
        });
        closeModal();
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 p-6 overflow-auto">
                    <h1 className="text-2xl font-bold mb-6">Invoice Manager</h1>
                    <div className="mb-6 flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Create New Invoice
                        </button>
                    </div>
                    <Table className="bg-white shadow-md rounded-lg">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'id'}
                                        direction={sortConfig.key === 'id' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('id')}
                                    >
                                        Invoice #
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'customerName'}
                                        direction={sortConfig.key === 'customerName' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('customerName')}
                                    >
                                        Customer
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'date'}
                                        direction={sortConfig.key === 'date' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('date')}
                                    >
                                        Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'total'}
                                        direction={sortConfig.key === 'total' ? sortConfig.direction : 'asc'}
                                        onClick={() => requestSort('total')}
                                    >
                                        Total
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInvoices.map(invoice => (
                                <TableRow key={invoice.id} className="hover:bg-gray-50">
                                    <TableCell>{invoice.id}</TableCell>
                                    <TableCell>{invoice.customerName}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>${invoice.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => openModal(invoice)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            <Edit />
                                        </button>
                                        <PDFDownloadLink
                                            document={<InvoicePDF invoice={invoice} />}
                                            fileName={`invoice_${invoice.id}.pdf`}
                                        >
                                            {({ loading }) =>
                                                loading ? (
                                                    <span>Loading...</span>
                                                ) : (
                                                    <FileDownload className="text-green-500 hover:text-green-700" />
                                                )
                                            }
                                        </PDFDownloadLink>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {isModalOpen && (
                <InvoiceModal
                    isOpen={isModalOpen}
                    invoice={selectedInvoice}
                    onClose={closeModal}
                    onSave={handleSaveInvoice}
                />
            )}
        </div>
    );
};

// Fake invoice data
const fakeInvoices = [
    {
        id: 'INV-001',
        customerName: 'Acme Corp',
        date: '2023-05-15',
        items: [
            { description: 'Web Development Services', amount: 2500 },
            { description: 'Hosting (1 year)', amount: 200 },
            { description: 'Tyre, replacement', amount: 200 },
        ],
        total: 2700,
    },
    {
        id: 'INV-002',
        customerName: 'TechStart Inc',
        date: '2023-05-18',
        items: [
            { description: 'App Development', amount: 5000 },
            { description: 'Maintenance (3 months)', amount: 600 },
        ],
        total: 5600,
    },
    {
        id: 'INV-003',
        customerName: 'Global Solutions',
        date: '2023-06-01',
        items: [
            { description: 'Consulting', amount: 3000 },
            { description: 'Training', amount: 1500 },
        ],
        total: 4500,
    },
];

export default InvoiceManager;
