import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import './JobModal.css';
import axiosInstance from '../../api/axiosInstance';

Modal.setAppElement('#root');

const JobModal = ({ isOpen, onClose, onRequestClose, job, onSave, technicians, vehicles }) => {
    const [localJob, setLocalJob] = useState({
        Customer: null,
        Vehicle: null,
        Technician: null,
        startDate: null,
        endDate: null,
        pickupDate: null,
    });

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const isValidDate = (date) => date instanceof Date && !isNaN(date);

    useEffect(() => {
        if (job) {
            setLoading(true);
            setLocalJob(prev => ({
                ...prev,
                JobId: job.jobId || job.JobId,
                Description: job.Description || '',
                Notes: job.Notes || '',
                startDate: isValidDate(new Date(job.startDate)) ? new Date(job.startDate) : null,
                endDate: isValidDate(new Date(job.endDate)) ? new Date(job.endDate) : null,
                pickupDate: isValidDate(new Date(job.pickupDate)) ? new Date(job.pickupDate) : null,
                Customer: job.Customer || (job.customerName ? { label: job.customerName, value: job.customerId } : null),
                Vehicle: job.Vehicle || (job.vehicleMake && job.vehicleModel ? { label: `${job.vehicleMake} ${job.vehicleModel}`, value: job.vehicleId } : null),
                Technician: job.Technician || (job.assignedEmployees && Array.isArray(job.assignedEmployees) 
                    ? { label: job.assignedEmployees.join(', '), value: job.technicianId }
                    : null),
            }));
            fetchDetails(job);
        }
    }, [job]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axiosInstance.get('/customer/customers');
                const customerOptions = response.data.map(customer => ({
                    label: `${customer.firstName} ${customer.lastName}`,
                    value: customer.id,
                }));
                setCustomers(customerOptions);
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        };

        fetchCustomers();
    }, []);

    const fetchDetails = async (job) => {
        try {
            const detailsToFetch = [];
            if (!job.Customer) detailsToFetch.push(axiosInstance.get(`/customer/customers/${job.customerId}`));
            if (!job.Vehicle) detailsToFetch.push(axiosInstance.get(`vehicle/${job.vehicleId}`));
            if (!job.Technician) detailsToFetch.push(axiosInstance.get(`technician/${job.technicianId}`));

            if (detailsToFetch.length > 0) {
                const responses = await Promise.all(detailsToFetch);
                const updatedJob = { ...localJob };

                responses.forEach(response => {
                    const data = response.data;
                    if (data.firstName && data.lastName) {
                        updatedJob.Customer = { label: `${data.firstName} ${data.lastName}`, value: data.id };
                    } else if (data.model) {
                        updatedJob.Vehicle = { label: data.model, value: data.id };
                    } else if (data.name) {
                        updatedJob.Technician = { label: data.name, value: data.id };
                    }
                });

                setLocalJob(updatedJob);
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalJob(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date, name) => {
        setLocalJob(prev => ({ ...prev, [name]: date }));
    };

    const handleSelectChange = (selectedOption, name) => {
        setLocalJob(prev => ({ ...prev, [name]: selectedOption }));
    };

    const handleSave = () => {
        onSave(localJob);
        handleClose();
    };

    const handleClose = () => {
        if (onClose) onClose();
        if (onRequestClose) onRequestClose();
    };

    if (loading) return null;

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

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '38px',
            height: '38px',
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '38px',
            padding: '0 6px',
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '38px',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '150px',
        }),
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Job Details"
            style={customStyles}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Job {localJob.JobId}</h2>
                    <button onClick={handleClose} className="text-white hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Customer</label>
                                <Select
                                    options={customers}
                                    value={localJob.Customer}
                                    onChange={(option) => handleSelectChange(option, 'Customer')}
                                    styles={selectStyles}
                                />
                            </div>
                            <div>
                                <label className="form-label">Vehicle</label>
                                <Select
                                    options={vehicles}
                                    value={localJob.Vehicle}
                                    onChange={(option) => handleSelectChange(option, 'Vehicle')}
                                    styles={selectStyles}
                                />
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    name="Description"
                                    value={localJob.Description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Notes</label>
                                <textarea
                                    name="Notes"
                                    value={localJob.Notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Start Date</label>
                                <DatePicker
                                    selected={localJob.startDate}
                                    onChange={(date) => handleDateChange(date, 'startDate')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">End Date</label>
                                <DatePicker
                                    selected={localJob.endDate}
                                    onChange={(date) => handleDateChange(date, 'endDate')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Pickup Date</label>
                                <DatePicker
                                    selected={localJob.pickupDate}
                                    onChange={(date) => handleDateChange(date, 'pickupDate')}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">Technician</label>
                                <Select
                                    options={technicians}
                                    value={localJob.Technician}
                                    onChange={(option) => handleSelectChange(option, 'Technician')}
                                    styles={selectStyles}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-4 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default JobModal;