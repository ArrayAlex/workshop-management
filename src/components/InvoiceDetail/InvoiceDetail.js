import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../InvoicePDF/InvoicePDF'; // Import your PDF generation component

const InvoiceDetail = ({ invoice, onClose }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Close Button */}
      <button onClick={onClose} className="mb-4 text-red-600 hover:text-red-800">
        Close
      </button>

      {/* Logo and Business Information */}
      <div className="flex justify-between items-center mb-6">
        <img src="https://placehold.co/600x400/000000/BBBB.png" alt="Logo" className="w-24 h-24" />
        <div className="text-right">
          <h2 className="text-lg font-bold">Business Name</h2>
          <p>123 Business Street</p>
          <p>Business City, BC 12345</p>
          <p>Email: contact@business.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Bill To:</h3>
        <p>{invoice.customerName || 'Customer Name'}</p>
        <p>{invoice.customerAddress || 'Customer Address'}</p>
        <p>Email: {invoice.customerEmail || 'customer@email.com'}</p>
        <p>Phone: {invoice.customerPhone || '+1 987 654 3210'}</p>
      </div>

      {/* Invoice Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Invoice #{invoice.id || 'INV-001'}</h3>
        <p>Date: {invoice.date || '2024-10-01'}</p>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-4 border-b border-gray-300 pb-2">
          <div className="font-bold">Description</div>
          <div className="font-bold">Quantity</div>
          <div className="font-bold">Price</div>
          <div className="font-bold">Amount</div>
        </div>
        {invoice.items && invoice.items.length > 0 ? (
          invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 border-b border-gray-200 py-2">
              <div>{item.description || 'N/A'}</div>
              <div>{item.quantity || 0}</div>
              <div>${item.price ? item.price.toFixed(2) : '0.00'}</div>
              <div>${item.amount ? item.amount.toFixed(2) : '0.00'}</div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-4 gap-4 py-2">
            <div className="col-span-4">No items found.</div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Notes:</h3>
        <p>Thank you for your business! Please make the payment by the due date mentioned in the invoice.</p>
      </div>

      {/* Total Section */}
      <div className="text-right border-t border-gray-300 pt-4">
        <h3 className="font-bold">Total:</h3>
        <p>Subtotal: ${invoice.subtotal ? invoice.subtotal.toFixed(2) : '0.00'}</p>
        <p>Tax: ${invoice.tax ? invoice.tax.toFixed(2) : '0.00'}</p>
        <p className="text-xl font-bold">Total: ${invoice.total ? invoice.total.toFixed(2) : '0.00'}</p>
      </div>

      {/* Download Button */}
      <PDFDownloadLink
        document={<InvoicePDF invoice={invoice} />}
        fileName={`invoice_${invoice.id}.pdf`}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        {({ loading }) =>
          loading ? (
            <span>Loading...</span>
          ) : (
            'Download PDF'
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

export default InvoiceDetail;
