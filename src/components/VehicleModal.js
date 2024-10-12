import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './VehicleModal.css';

Modal.setAppElement('#root');

const VehicleModal = ({ isOpen, onRequestClose, vehicleData, onSave }) => {
    const [vehicleDetails, setVehicleDetails] = useState({
        id: '',
        make: '',
        model: '',
        year: '',
        rego: '',
        vin: '',
        color: '',
        customerId: '',
    });

    useEffect(() => {
        if (vehicleData) {
            setVehicleDetails(vehicleData);
        } else {
            setVehicleDetails({
                id: '',
                make: '',
                model: '',
                year: '',
                rego: '',
                vin: '',
                color: '',
                customerId: '',
            });
        }
    }, [vehicleData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(vehicleDetails);
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
            contentLabel="Vehicle Details"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        {vehicleDetails.id ? `Edit Vehicle: ${vehicleDetails.make} ${vehicleDetails.model}` : 'Add New Vehicle'}
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
                                <label className="form-label" htmlFor="make">Make</label>
                                <input
                                    type="text"
                                    id="make"
                                    name="make"
                                    value={vehicleDetails.make}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="model">Model</label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={vehicleDetails.model}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="form-label" htmlFor="year">Year</label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={vehicleDetails.year}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="rego">Registration</label>
                                <input
                                    type="text"
                                    id="rego"
                                    name="rego"
                                    value={vehicleDetails.rego}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label" htmlFor="color">Color</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    value={vehicleDetails.color}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="form-label" htmlFor="vin">VIN</label>
                            <input
                                type="text"
                                id="vin"
                                name="vin"
                                value={vehicleDetails.vin}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="form-label" htmlFor="customerId">Customer ID</label>
                            <input
                                type="text"
                                id="customerId"
                                name="customerId"
                                value={vehicleDetails.customerId}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
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

export default VehicleModal;