import React, { useState, useEffect, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceModal from '../InvoiceModal/InvoiceModal';
import InvoiceDetail from '../InvoiceDetail/InvoiceDetail'; // Import the new component
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import { Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel } from '@mui/material';
import { Search, Edit, FileDownload } from '@mui/icons-material';
import './InvoiceManager.css';
import InvoicePDF from '../InvoicePDF/InvoicePDF';
import { Helmet } from 'react-helmet';
const InvoiceManager = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false); // State for invoice detail
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

    const openDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailOpen(true);
    };

    const closeDetail = () => {
        setSelectedInvoice(null);
        setIsDetailOpen(false);
    };

    const handleSaveInvoice = (newInvoice) => {
        setInvoices(prevInvoices => {
            if (selectedInvoice) {
                return prevInvoices.map(inv => 
                    inv.id === newInvoice.id ? newInvoice : inv
                );
            } else {
                return [...prevInvoices, newInvoice];
            }
        });
        closeModal();
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Helmet>
            <title>Invoices | Hoist</title>
            <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>
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
                                            onClick={() => openDetail(invoice)} // Add View button
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            View
                                        </button>
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
            {isDetailOpen && selectedInvoice && ( // Show invoice detail modal
                <InvoiceDetail
                    invoice={selectedInvoice}
                    onClose={closeDetail}
                />
            )}
        </div>
    );
};

// Fake invoice data (same as before)
const fakeInvoices = [
    {
        id: 'INV-001',
        customerName: 'John Doe',
        date: '2024-10-01',
        total: 250.0,
        items: [
            { description: 'Service A', amount: 100.0 },
            { description: 'Service B', amount: 150.0 },
        ],
    },
    {
        id: 'INV-002',
        customerName: 'Jane Smith',
        date: '2024-10-05',
        total: 450.0,
        items: [
            { description: 'Service C', amount: 200.0 },
            { description: 'Service D', amount: 250.0 },
        ],
    },
];

export default InvoiceManager;
