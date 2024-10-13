import React, { useState } from 'react';

const JobStatusesSettings = () => {
  const [jobStatuses, setJobStatuses] = useState([
    { id: 1, name: 'Pending', color: '#FF9800' },
    { id: 2, name: 'In Progress', color: '#2196F3' },
    { id: 3, name: 'Completed', color: '#4CAF50' },
    { id: 4, name: 'On Hold', color: '#FF5722' },
    { id: 5, name: 'Cancelled', color: '#F44336' },
  ]);

  const [newJobStatus, setNewJobStatus] = useState({ name: '', color: '#000000' });
  const [editingJobStatus, setEditingJobStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddJobStatus = () => {
    if (newJobStatus.name) {
      const newStatus = { ...newJobStatus, id: Date.now() };
      setJobStatuses([...jobStatuses, newStatus]);
      setNewJobStatus({ name: '', color: '#000000' });
      setIsModalOpen(false);
    }
  };

  const handleEditJobStatus = (status) => {
    setEditingJobStatus(status);
    setNewJobStatus({ name: status.name, color: status.color });
    setIsModalOpen(true);
  };

  const handleUpdateJobStatus = () => {
    if (editingJobStatus) {
      const updatedJobStatuses = jobStatuses.map((status) =>
        status.id === editingJobStatus.id ? { ...editingJobStatus, name: newJobStatus.name, color: newJobStatus.color } : status
      );
      setJobStatuses(updatedJobStatuses);
      setEditingJobStatus(null);
      setNewJobStatus({ name: '', color: '#000000' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteJobStatus = (id) => {
    setJobStatuses(jobStatuses.filter(status => status.id !== id));
  };

  const filteredJobStatuses = jobStatuses.filter(status => 
    status.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Job Statuses</h2>
        <button 
          onClick={() => { setEditingJobStatus(null); setNewJobStatus({ name: '', color: '#000000' }); setIsModalOpen(true); }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Job Status
        </button>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search Job Statuses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 pl-8"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Job Status Name</th>
            <th className="border px-4 py-2 text-left">Color</th>
            <th className="border px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobStatuses.map(status => (
            <tr key={status.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{status.name}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                  {status.color}
                </div>
              </td>
              <td className="border px-4 py-2 text-right">
                <button onClick={() => handleEditJobStatus(status)} className="text-blue-500 hover:underline mr-2">Edit</button>
                <button onClick={() => handleDeleteJobStatus(status.id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">{editingJobStatus ? 'Edit Job Status' : 'Add New Job Status'}</h3>
            <input
              type="text"
              placeholder="Job Status Name"
              value={newJobStatus.name}
              onChange={(e) => setNewJobStatus({ ...newJobStatus, name: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <div className="flex items-center mb-4">
              <input
                type="color"
                value={newJobStatus.color}
                onChange={(e) => setNewJobStatus({ ...newJobStatus, color: e.target.value })}
                className="w-10 h-10 border border-gray-300 rounded mr-2"
              />
              <span>{newJobStatus.color}</span>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-200 mr-2">
                Cancel
              </button>
              <button onClick={editingJobStatus ? handleUpdateJobStatus : handleAddJobStatus} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                {editingJobStatus ? 'Update' : 'Add'} Job Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobStatusesSettings;