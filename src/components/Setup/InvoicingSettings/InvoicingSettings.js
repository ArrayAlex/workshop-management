import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const InvoicingSettings = () => {
  const [invoicingSettings, setInvoicingSettings] = useState({
    invoicePrefix: 'INV-',
    taxRate: '10',
    currency: 'USD',
    paymentTerms: 'Net 30',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoicingSettings({ ...invoicingSettings, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <DollarSign className="text-gray-400" />
        <input
          type="text"
          name="invoicePrefix"
          value={invoicingSettings.invoicePrefix}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Invoice Prefix"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          name="taxRate"
          value={invoicingSettings.taxRate}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Tax Rate (%)"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name="currency"
          value={invoicingSettings.currency}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Currency"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name="paymentTerms"
          value={invoicingSettings.paymentTerms}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Payment Terms"
        />
      </div>
    </div>
  );
};

export default InvoicingSettings;