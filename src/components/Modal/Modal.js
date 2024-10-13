import React from 'react';
import InvoiceDetail from '../InvoiceDetail/InvoiceDetail'; // Adjust the import path as necessary

const Modal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen) return null; // Don't render anything if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">
          &times; {/* Close icon */}
        </button>
        <InvoiceDetail invoice={invoice} />
      </div>
    </div>
  );
};

export default Modal;
