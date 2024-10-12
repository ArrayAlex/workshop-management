import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './CustomerModal.css';

Modal.setAppElement('#root');

const CustomerModal = ({ isOpen, onRequestClose, customerData, onSave }) => {
    const [customerDetails, setCustomerDetails] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        if (customerData) {
            setCustomerDetails(customerData);
        } else {
            setCustomerDetails({
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                postalCode: '',
                country: ''
            });
        }
    }, [customerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(customerDetails);
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '0',
            border: 'none',
            borderRadius: '0.5rem',
            maxWidth: '80vw',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'visible',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel="Customer Details"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {customerDetails.id ? `Edit Customer: ${customerDetails.firstName} ${customerDetails.lastName}` : 'Add New Customer'}
                    </h2>
                    <button onClick={onRequestClose} className="text-white hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label" htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={customerDetails.firstName}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={customerDetails.lastName}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={customerDetails.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={customerDetails.phone}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="addressLine1">Address Line 1</label>
                            <input
                                type="text"
                                id="addressLine1"
                                name="addressLine1"
                                value={customerDetails.addressLine1}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="addressLine2">Address Line 2</label>
                            <input
                                type="text"
                                id="addressLine2"
                                name="addressLine2"
                                value={customerDetails.addressLine2}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="form-label" htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={customerDetails.city}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={customerDetails.postalCode}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={customerDetails.country}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex justify-end space-x-4 p-4 border-t border-gray-200">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={onRequestClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CustomerModal;