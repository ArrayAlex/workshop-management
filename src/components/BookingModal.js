import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import './BookingModal.css';

Modal.setAppElement('#root');

const BookingModal = ({ isOpen, onClose, editedEvent, onSave, technicians }) => {
  const [localEvent, setLocalEvent] = useState(editedEvent);

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
    setLocalEvent(prev => ({ ...prev, technicians: selectedOptions }));
  };

  const handleSave = () => {
    onSave(localEvent);
    onClose();
  };

  if (!localEvent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Booking Details"
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Job {localEvent.id}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="form-label">Customer</label>
                <input
                  type="text"
                  name="title"
                  value={localEvent.title.split(' - ')[1]}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={localEvent.phone || ""}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Rego</label>
                <input
                  type="text"
                  value="TANTIVE IV"
                  className="form-input bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={localEvent.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-input"
                ></textarea>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Start</label>
                <DatePicker
                  selected={localEvent.start}
                  onChange={(date) => handleDateChange(date, 'start')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">End</label>
                <DatePicker
                  selected={localEvent.end}
                  onChange={(date) => handleDateChange(date, 'end')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Est. Hours</label>
                <input
                  type="text"
                  value={((localEvent.end - localEvent.start) / (1000 * 60 * 60)).toFixed(2)}
                  className="form-input bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">Pickup</label>
                <DatePicker
                  selected={localEvent.pickup}
                  onChange={(date) => handleDateChange(date, 'pickup')}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Technicians</label>
                <Select
                  isMulti
                  name="technicians"
                  options={technicians}
                  value={localEvent.technicians}
                  onChange={handleTechnicianChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              <div>
                <label className="form-label">Job Status</label>
                <select
                  name="jobStatus"
                  value={localEvent.jobStatus}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Booked">Booked</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button className="btn btn-primary">
            Open Job
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;