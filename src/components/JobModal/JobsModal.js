import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import './JobModal.css';
import axiosInstance from '../../api/axiosInstance';

Modal.setAppElement('#root');

const JobModal = ({ isOpen, onClose, job, onSave, technicians = [], customers = [], vehicles = [] }) => {
    const [localJob, setLocalJob] = useState({
        jobId: null,
        customerId: null,
        vehicleId: null,
        technicianId: null,
        notes: '',
        appointmentId: null,
        jobStatus: null,
        jobType: null,
        updatedAt: null,
        createdAt: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (job) {
            setLocalJob({
                jobId: job.jobId,
                customerId: job.customerId,
                vehicleId: job.vehicleId,
                technicianId: job.technicianId,
                notes: job.notes || '',
                appointmentId: job.appointmentId,
                jobStatus: job.jobStatus,
                jobType: job.jobType,
                updatedAt: job.updatedAt ? new Date(job.updatedAt) : null,
                createdAt: job.createdAt ? new Date(job.createdAt) : null
            });
        }
        setLoading(false);
    }, [job]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalJob(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, name) => {
        setLocalJob(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : null }));
    };

    const handleSave = () => {
        onSave(localJob);
        onClose();
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
            onRequestClose={onClose}
            contentLabel="Job Details"
            style={customStyles}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Job {localJob.jobId || 'New'}</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {customers.length > 0 && (
                                <div>
                                    <label className="form-label">Customer</label>
                                    <Select
                                        options={customers}
                                        value={customers.find(c => c.value === localJob.customerId) || null}
                                        onChange={(option) => handleSelectChange(option, 'customerId')}
                                        styles={selectStyles}
                                    />
                                </div>
                            )}
                            {vehicles.length > 0 && (
                                <div>
                                    <label className="form-label">Vehicle</label>
                                    <Select
                                        options={vehicles}
                                        value={vehicles.find(v => v.value === localJob.vehicleId) || null}
                                        onChange={(option) => handleSelectChange(option, 'vehicleId')}
                                        styles={selectStyles}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="form-label">Notes</label>
                                <textarea
                                    name="notes"
                                    value={localJob.notes || ''}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {technicians.length > 0 && (
                                <div>
                                    <label className="form-label">Technician</label>
                                    <Select
                                        options={technicians}
                                        value={technicians.find(t => t.value === localJob.technicianId) || null}
                                        onChange={(option) => handleSelectChange(option, 'technicianId')}
                                        styles={selectStyles}
                                    />
                                </div>
                            )}
                            {localJob.jobStatus && (
                                <div>
                                    <label className="form-label">Job Status</label>
                                    <div
                                        className="px-2 py-1 rounded text-white text-sm inline-block"
                                        style={{ backgroundColor: localJob.jobStatus.color }}
                                    >
                                        {localJob.jobStatus.title}
                                    </div>
                                </div>
                            )}
                            {localJob.jobType && (
                                <div>
                                    <label className="form-label">Job Type</label>
                                    <div
                                        className="px-2 py-1 rounded text-white text-sm inline-block"
                                        style={{ backgroundColor: localJob.jobType.color || '#808080' }}
                                    >
                                        {localJob.jobType.title || 'N/A'}
                                    </div>
                                </div>
                            )}
                            {localJob.createdAt && (
                                <div>
                                    <label className="form-label">Created At</label>
                                    <p>{localJob.createdAt.toLocaleString()}</p>
                                </div>
                            )}
                            {localJob.updatedAt && (
                                <div>
                                    <label className="form-label">Updated At</label>
                                    <p>{localJob.updatedAt.toLocaleString()}</p>
                                </div>
                            )}
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
                        onClick={onClose}
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