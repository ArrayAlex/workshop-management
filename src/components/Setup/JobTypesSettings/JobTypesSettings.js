import React, { useState } from 'react';

const JobTypesSettings = () => {
  const [jobTypes, setJobTypes] = useState([
    { id: 1, name: 'Repair', color: '#4CAF50' },
    { id: 2, name: 'Maintenance', color: '#2196F3' },
    { id: 3, name: 'Installation', color: '#FF9800' },
    { id: 4, name: 'Inspection', color: '#FF5722' },
    { id: 5, name: 'Consultation', color: '#9C27B0' },
  ]);

  const [newJobType, setNewJobType] = useState({ name: '', color: '#000000' });
  const [editingJobType, setEditingJobType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddJobType = () => {
    if (newJobType.name) {
      const newType = { ...newJobType, id: Date.now() };
      setJobTypes([...jobTypes, newType]);
      setNewJobType({ name: '', color: '#000000' });
      setIsModalOpen(false);
    }
  };

  const handleEditJobType = (job) => {
    setEditingJobType(job);
    setNewJobType({ name: job.name, color: job.color });
    setIsModalOpen(true);
  };

  const handleUpdateJobType = () => {
    if (editingJobType) {
      const updatedJobTypes = jobTypes.map((job) =>
        job.id === editingJobType.id ? { ...editingJobType, name: newJobType.name, color: newJobType.color } : job
      );
      setJobTypes(updatedJobTypes);
      setEditingJobType(null);
      setNewJobType({ name: '', color: '#000000' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteJobType = (id) => {
    setJobTypes(jobTypes.filter(job => job.id !== id));
  };

  const filteredJobTypes = jobTypes.filter(job => 
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Job Types</h2>
        <button 
          onClick={() => { setEditingJobType(null); setNewJobType({ name: '', color: '#000000' }); setIsModalOpen(true); }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Job Type
        </button>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search Job Types"
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
            <th className="border px-4 py-2 text-left">Job Type Name</th>
            <th className="border px-4 py-2 text-left">Color</th>
            <th className="border px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobTypes.map(job => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{job.name}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: job.color }}></div>
                  {job.color}
                </div>
              </td>
              <td className="border px-4 py-2 text-right">
                <button onClick={() => handleEditJobType(job)} className="text-blue-500 hover:underline mr-2">Edit</button>
                <button onClick={() => handleDeleteJobType(job.id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">{editingJobType ? 'Edit Job Type' : 'Add New Job Type'}</h3>
            <input
              type="text"
              placeholder="Job Type Name"
              value={newJobType.name}
              onChange={(e) => setNewJobType({ ...newJobType, name: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <div className="flex items-center mb-4">
              <input
                type="color"
                value={newJobType.color}
                onChange={(e) => setNewJobType({ ...newJobType, color: e.target.value })}
                className="w-10 h-10 border border-gray-300 rounded mr-2"
              />
              <span>{newJobType.color}</span>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-200 mr-2">
                Cancel
              </button>
              <button onClick={editingJobType ? handleUpdateJobType : handleAddJobType} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                {editingJobType ? 'Update' : 'Add'} Job Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTypesSettings;