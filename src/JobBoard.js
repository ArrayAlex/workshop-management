// src/JobBoard.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from './components/Navbar'; // Import Navbar
import Sidebar from './components/Sidebar'; // Import Sidebar

// Sample data for jobs
const initialJobs = {
  'to-do': [
    {
      id: '1',
      title: 'Appt Confirmed',
      jobId: 'JOB001',
      invoiceAmount: '$150',
      assignedEmployees: ['JD', 'AE'],
      customerName: 'John Doe',
      contactNumber: '123-456-7890',
      vehicleMake: 'Toyota',
      vehicleModel: 'Corolla',
      numberPlate: 'ABC-1234',
      labelColor: 'bg-red-500', // Add initial label color
    },
  ],
  'in-progress': [
    {
      id: '2',
      title: 'Waiting On Approval',
      jobId: 'JOB002',
      invoiceAmount: '$200',
      assignedEmployees: ['SR'],
      customerName: 'Jane Smith',
      contactNumber: '987-654-3210',
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      numberPlate: 'XYZ-5678',
      labelColor: 'bg-green-500', // Add initial label color
    },
  ],
  'completed': [
    {
      id: '3',
      title: 'Work Completed',
      jobId: 'JOB003',
      invoiceAmount: '$300',
      assignedEmployees: ['MK'],
      customerName: 'Sam Wilson',
      contactNumber: '456-789-1234',
      vehicleMake: 'Ford',
      vehicleModel: 'Focus',
      numberPlate: 'LMN-9012',
      labelColor: 'bg-blue-500', // Add initial label color
    },
  ],
};

const labels = [
  { name: 'Appt Confirmed', color: 'bg-red-500' },
  { name: 'Waiting On Approval', color: 'bg-green-500' },
  { name: 'Work Completed', color: 'bg-blue-500' },
  { name: 'Called Customer', color: 'bg-yellow-500' },
];

const JobBoard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) {
      const newJobs = Array.from(jobs[sourceColumn]);
      const [removed] = newJobs.splice(source.index, 1);
      newJobs.splice(destination.index, 0, removed);

      setJobs((prevJobs) => ({
        ...prevJobs,
        [sourceColumn]: newJobs,
      }));
    } else {
      const sourceJobs = Array.from(jobs[sourceColumn]);
      const destJobs = Array.from(jobs[destColumn]);
      const [removed] = sourceJobs.splice(source.index, 1);
      destJobs.splice(destination.index, 0, removed);

      setJobs((prevJobs) => ({
        ...prevJobs,
        [sourceColumn]: sourceJobs,
        [destColumn]: destJobs,
      }));
    }
  };

  const toggleDropdown = (jobId) => {
    setSelectedJobId((prevId) => (prevId === jobId ? null : jobId));
  };

  const handleLabelClick = (jobId, newLabel) => {
    setJobs((prevJobs) => {
      const newJobs = { ...prevJobs };
      Object.entries(newJobs).forEach(([columnName]) => {
        newJobs[columnName] = newJobs[columnName].map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              title: newLabel.name, // Update job's title
              labelColor: newLabel.color, // Update job's label color
            };
          }
          return job;
        });
      });
      return newJobs;
    });
  };

  const filteredJobs = Object.entries(jobs).reduce((acc, [columnName, columnJobs]) => {
    const filtered = columnJobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    acc[columnName] = filtered;
    return acc;
  }, { ...initialJobs });

  const handleCreateJob = () => {
    alert('Create Job Card Clicked');
  };

  return (
    <div className="flex flex-col h-screen bg-white-100">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex-1 overflow-hidden pl-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pt-5">
            <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
            <input
              type="text"
              placeholder="Search jobs..."
              className="border rounded-lg p-2 w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleCreateJob}
              className="bg-blue-600 text-white rounded-lg px-4 py-2"
            >
              Create Job Card
            </button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 h-full overflow-hidden">
              {Object.entries(filteredJobs).map(([columnName, columnJobs]) => (
                <Droppable key={columnName} droppableId={columnName}>
                  {(provided) => (
                    <div
                      className="bg-white shadow-md flex flex-col flex-grow h-full"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {/* Column Header */}
                      <div className={`bg-gray-200 p-2`}>
                        <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
                          <span>{columnName.replace('-', ' ').toUpperCase()} ({columnJobs.length})</span>
                          <button className="text-blue-500 text-sm">Filter</button>
                        </h2>
                      </div>

                      <div className="flex-grow overflow-y-auto p-2">
                        {columnJobs.map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided) => (
                              <div
                                className="bg-gray-50 rounded-lg-200 p-4 mb-2 shadow-md relative  hover:shadow-lg transition-shadow duration-300"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="flex justify-between">
                                  {/* Display the job title as a label by default */}
                                  <span
                                    className={`cursor-pointer text-sm ${job.labelColor} text-white px-2 py-1 rounded-md`}
                                    onClick={() => toggleDropdown(job.id)} // Toggle dropdown on job title click
                                  >
                                    {job.title}
                                  </span>
                                  <span className="text-xs text-gray-400">{job.jobId}</span>
                                </div>

                                {/* Always Visible Job Details */}
                                <div className="mt-2">
                                  <div className="text-xs">
                                    <span className="font-semibold">Invoice:</span> {job.invoiceAmount}
                                  </div>
                                  <div className="mt-2 flex">
                                    {job.assignedEmployees.map((initial, idx) => (
                                      <div
                                        key={idx}
                                        className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mx-1"
                                      >
                                        {initial}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-2">
                                    <div className="text-xs">
                                      <span className="font-semibold">Customer:</span> {job.customerName} - {job.contactNumber}
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-semibold">Vehicle:</span> {job.vehicleMake} {job.vehicleModel} ({job.numberPlate})
                                    </div>
                                  </div>
                                </div>

                                {/* Dropdown for additional labels */}
                                {selectedJobId === job.id && (
                                  <div className="absolute left-0 right-0 top-full bg-white shadow-lg mt-1 rounded z-10">
                                    <div className="p-2">
                                      <h3 className="font-semibold text-sm mb-2">Change Job Label</h3>
                                      {labels.map((label) => (
                                        <button
                                          key={label.name}
                                          onClick={() => handleLabelClick(job.id, label)}
                                          className={`flex items-center space-x-2 p-1 rounded hover:bg-gray-200 w-full text-left ${label.color}`}
                                        >
                                          <span className="text-white">{label.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
