import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import './BookingModal.css';
import axiosInstance from '../../api/axiosInstance';

Modal.setAppElement('#root');

const BookingModal = ({ isOpen, onClose, editedEvent, onSave, technicians }) => {
  const [localEvent, setLocalEvent] = useState(editedEvent);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setLocalEvent(editedEvent);
    if (editedEvent) {
      fetchCustomers();
      fetchVehicles();
      fetchJobs(editedEvent.id);
    }
  }, [editedEvent]);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/Customer/Customers');
      setCustomers(response.data.map(customer => ({
        value: customer.id,
        label: `${customer.firstName} ${customer.lastName}`
      })));
      setSelectedCustomer({ value: editedEvent.customer.id, label: editedEvent.customer.name });
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axiosInstance.get('/Vehicle/Vehicles');
      setVehicles(response.data.map(vehicle => ({
        value: vehicle.id,
        label: `${vehicle.make} ${vehicle.model} (${vehicle.rego})`
      })));
      setSelectedVehicle({ value: editedEvent.vehicle.id, label: `${editedEvent.vehicle.make} ${editedEvent.vehicle.model} (${editedEvent.vehicle.rego})` });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchJobs = async (appointmentId) => {
    try {
      const response = await axiosInstance.get(`/Job/jobs?appointmentId=${appointmentId}`);
      setJobs(response.data.map(job => ({
        ...job,
        status: job.jobStatus.title,
        statusColor: job.jobStatus.color,
        type: job.jobType.title,
        typeColor: job.jobType.color,

      })));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleCustomerChange = async (selectedOption) => {
    setSelectedCustomer(selectedOption);
    try {
      await axiosInstance.put(
        `/Appointment/updateCustomer/${localEvent.id}`, 
        JSON.stringify({ customerId: selectedOption.value }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setLocalEvent(prev => ({ 
        ...prev, 
        customer: { id: selectedOption.value, name: selectedOption.label } 
      }));
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleVehicleChange = async (selectedOption) => {
    setSelectedVehicle(selectedOption);
    try {
      await axiosInstance.put(
        `/Appointment/updateVehicle/${localEvent.id}`, 
        JSON.stringify(selectedOption.value),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setLocalEvent(prev => ({ 
        ...prev, 
        vehicle: { 
          id: selectedOption.value, 
          make: selectedOption.label.split(' ')[0], 
          model: selectedOption.label.split(' ')[1], 
          rego: selectedOption.label.split('(')[1].replace(')', '') 
        } 
      }));
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const handleAddJob = async () => {
    try {
      const response = await axiosInstance.post('/Job/add', { appointmentId: localEvent.id });
      setJobs(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleUpdateJob = async (jobId, updatedData) => {
    try {
      const response = await axiosInstance.put(`/Job/update/${jobId}`, updatedData);
      setJobs(prev => prev.map(job => job.id === jobId ? response.data : job));
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(`/Job/delete/${jobId}`);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  useEffect(() => {
    setLocalEvent(editedEvent);
  }, [editedEvent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setLocalEvent(prev => ({ ...prev, [name]: date }));
  };

  const handleTechnicianChange = (selectedOptions) => {
    setLocalEvent(prev => ({ ...prev, technicians: selectedOptions.map(option => option.value) }));
  };

  const handleSave = async () => {
    try {
      if (!localEvent || !localEvent.id || !localEvent.customer || !localEvent.vehicle) {
        console.error('Appointment, customer, or vehicle information is missing');
        return;
      }
  
      const appointmentData = {
        id: localEvent.id,
        title: localEvent.title,
        start_time: localEvent.start,
        end_time: localEvent.end,
        description: localEvent.description || "",
        notes: localEvent.notes || "",
        bookingStatusId: localEvent.bookingStatus?.id,
        customerId: localEvent.customer?.id,
        vehicleId: localEvent.vehicle?.id,
        // Only serialize the `jobs` array correctly
        jobs: localEvent.jobs.map(job => job.id),  // Ensure this is serialized properly as IDs
        invoiceId: localEvent.invoiceId,
        technicians: localEvent.technicians || [],
      };
  
      let response;
      if (localEvent.id) {
        response = await axiosInstance.put('/Appointment/update', appointmentData);
      } else {
        response = await axiosInstance.post('/Appointment/add', appointmentData);
      }
  
      if (response.data === true) {
        onSave(localEvent);
        onClose();
      } else {
        throw new Error('Operation failed');
      }
    } catch (err) {
      console.error('Error saving appointment:', err);
    }
  };

  if (!localEvent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Booking Details"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white shadow-xl w-full max-w-4xl h-[90vh] flex flex-col rounded-sm">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Booking {localEvent?.id}</h2>
        </div>
        <div className="flex-grow flex flex-col">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'general' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'jobs' ? 'bg-blue-100 border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            {activeTab === 'general' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <Select
                      value={selectedCustomer}
                      onChange={handleCustomerChange}
                      options={customers}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                    <Select
                      value={selectedVehicle}
                      onChange={handleVehicleChange}
                      options={vehicles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <DatePicker
                      selected={localEvent.start_time}
                      onChange={(date) => handleDateChange(date, 'start')}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <DatePicker
                      selected={localEvent.end_time}
                      onChange={(date) => handleDateChange(date, 'end')}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={localEvent.notes || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input 
                    type="text" 
                    value={localEvent.bookingStatus?.title || ''} 
                    readOnly 
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technicians</label>
                  <Select
                    isMulti
                    value={localEvent.technicians.map(tech => ({ value: tech, label: tech }))}
                    options={technicians}
                    onChange={handleTechnicianChange}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </form>
            )}
            {activeTab === 'jobs' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Jobs</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobs.map(job => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{job.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{job.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <button onClick={() => handleUpdateJob(job.id, { status: 'In Progress' })} className="text-indigo-600 hover:text-indigo-900">Update</button>
                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={handleAddJob} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Add Job</button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;