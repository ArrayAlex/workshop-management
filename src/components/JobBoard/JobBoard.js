import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import JobModal from '../JobModal/JobsModal';
import { Helmet } from 'react-helmet';
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
      labelColor: 'bg-red-500',
    },
    {
      id: '2',
      title: 'Diagnostic Required',
      jobId: 'JOB002',
      invoiceAmount: '$200',
      assignedEmployees: ['MK'],
      customerName: 'Jane Smith',
      contactNumber: '987-654-3210',
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      numberPlate: 'XYZ-5678',
      labelColor: 'bg-yellow-500',
    },
    {
      id: '3',
      title: 'Oil Change',
      jobId: 'JOB003',
      invoiceAmount: '$75',
      assignedEmployees: ['AE'],
      customerName: 'Bob Johnson',
      contactNumber: '555-123-4567',
      vehicleMake: 'Ford',
      vehicleModel: 'F-150',
      numberPlate: 'DEF-9012',
      labelColor: 'bg-blue-500',
    },
    {
      id: '4',
      title: 'Brake Inspection',
      jobId: 'JOB004',
      invoiceAmount: '$100',
      assignedEmployees: ['JD', 'MK'],
      customerName: 'Alice Brown',
      contactNumber: '111-222-3333',
      vehicleMake: 'Chevrolet',
      vehicleModel: 'Malibu',
      numberPlate: 'GHI-3456',
      labelColor: 'bg-green-500',
    },
    {
      id: '5',
      title: 'Tire Rotation',
      jobId: 'JOB005',
      invoiceAmount: '$50',
      assignedEmployees: ['AE'],
      customerName: 'Charlie Davis',
      contactNumber: '444-555-6666',
      vehicleMake: 'Nissan',
      vehicleModel: 'Altima',
      numberPlate: 'JKL-7890',
      labelColor: 'bg-purple-500',
    },
  ],
  'in-progress': [
    {
      id: '6',
      title: 'Engine Repair',
      jobId: 'JOB006',
      invoiceAmount: '$500',
      assignedEmployees: ['JD', 'MK'],
      customerName: 'Eva Wilson',
      contactNumber: '777-888-9999',
      vehicleMake: 'BMW',
      vehicleModel: '3 Series',
      numberPlate: 'MNO-1234',
      labelColor: 'bg-orange-500',
    },
    {
      id: '7',
      title: 'Transmission Service',
      jobId: 'JOB007',
      invoiceAmount: '$350',
      assignedEmployees: ['AE'],
      customerName: 'Frank Miller',
      contactNumber: '222-333-4444',
      vehicleMake: 'Audi',
      vehicleModel: 'A4',
      numberPlate: 'PQR-5678',
      labelColor: 'bg-pink-500',
    },
    {
      id: '8',
      title: 'AC Repair',
      jobId: 'JOB008',
      invoiceAmount: '$250',
      assignedEmployees: ['MK'],
      customerName: 'Grace Taylor',
      contactNumber: '666-777-8888',
      vehicleMake: 'Hyundai',
      vehicleModel: 'Sonata',
      numberPlate: 'STU-9012',
      labelColor: 'bg-indigo-500',
    },
    {
      id: '9',
      title: 'Suspension Work',
      jobId: 'JOB009',
      invoiceAmount: '$400',
      assignedEmployees: ['JD', 'AE'],
      customerName: 'Henry Clark',
      contactNumber: '999-000-1111',
      vehicleMake: 'Mazda',
      vehicleModel: 'CX-5',
      numberPlate: 'VWX-3456',
      labelColor: 'bg-teal-500',
    },
  ],
  'completed': [
    {
      id: '10',
      title: 'Full Service',
      jobId: 'JOB010',
      invoiceAmount: '$300',
      assignedEmployees: ['JD', 'MK', 'AE'],
      customerName: 'Isabel Lee',
      contactNumber: '333-444-5555',
      vehicleMake: 'Volkswagen',
      vehicleModel: 'Golf',
      numberPlate: 'YZA-7890',
      labelColor: 'bg-gray-500',
    },
    {
      id: '11',
      title: 'Battery Replacement',
      jobId: 'JOB011',
      invoiceAmount: '$150',
      assignedEmployees: ['AE'],
      customerName: 'Jack Robinson',
      contactNumber: '888-999-0000',
      vehicleMake: 'Subaru',
      vehicleModel: 'Outback',
      numberPlate: 'BCD-1234',
      labelColor: 'bg-red-500',
    },
    {
      id: '12',
      title: 'Wheel Alignment',
      jobId: 'JOB012',
      invoiceAmount: '$80',
      assignedEmployees: ['MK'],
      customerName: 'Karen White',
      contactNumber: '555-666-7777',
      vehicleMake: 'Kia',
      vehicleModel: 'Sportage',
      numberPlate: 'EFG-5678',
      labelColor: 'bg-yellow-500',
    },
    {
      id: '13',
      title: 'Exhaust System Repair',
      jobId: 'JOB013',
      invoiceAmount: '$200',
      assignedEmployees: ['JD'],
      customerName: 'Liam Harris',
      contactNumber: '111-222-3333',
      vehicleMake: 'Jeep',
      vehicleModel: 'Cherokee',
      numberPlate: 'HIJ-9012',
      labelColor: 'bg-blue-500',
    },
    {
      id: '14',
      title: 'Windshield Replacement',
      jobId: 'JOB014',
      invoiceAmount: '$350',
      assignedEmployees: ['AE', 'MK'],
      customerName: 'Mia Turner',
      contactNumber: '444-555-6666',
      vehicleMake: 'Lexus',
      vehicleModel: 'RX',
      numberPlate: 'KLM-3456',
      labelColor: 'bg-green-500',
    },
  ],
};



const labels = [
  { name: 'Appt Confirmed', color: 'bg-red-500' },
  { name: 'Waiting On Approval', color: 'bg-yellow-500' },
  { name: 'Work Completed', color: 'bg-green-500' },
  { name: 'Called Customer', color: 'bg-blue-500' },
];

const JobBoard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const labelDropdownRef = useRef(null);

  const generateColor = (initials) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
      '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#FFD54F'
    ];
    
    const colorIndex = initials.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    const newJobs = { ...jobs };
    const sourceJobs = Array.from(newJobs[sourceColumn]);
    const [removed] = sourceJobs.splice(source.index, 1);

    if (sourceColumn === destColumn) {
      sourceJobs.splice(destination.index, 0, removed);
      newJobs[sourceColumn] = sourceJobs;
    } else {
      const destJobs = Array.from(newJobs[destColumn]);
      destJobs.splice(destination.index, 0, removed);
      newJobs[sourceColumn] = sourceJobs;
      newJobs[destColumn] = destJobs;
    }

    setJobs(newJobs);
  };

  const handleLabelClick = (e, jobId, currentLabel) => {
    e.stopPropagation();
    const dropdown = labelDropdownRef.current;
    if (dropdown) {
      dropdown.style.display = dropdown.dataset.jobId === jobId ? 'none' : 'block';
      dropdown.dataset.jobId = dropdown.dataset.jobId === jobId ? '' : jobId;
      dropdown.style.top = `${e.clientY}px`;
      dropdown.style.left = `${e.clientX}px`;
    }
  };

  const handleLabelChange = (jobId, newLabel) => {
    setJobs((prevJobs) => {
      const newJobs = { ...prevJobs };
      Object.entries(newJobs).forEach(([columnName]) => {
        newJobs[columnName] = newJobs[columnName].map((job) => {
          if (job.id === jobId) {
            return { ...job, title: newLabel.name, labelColor: newLabel.color };
          }
          return job;
        });
      });
      return newJobs;
    });
    if (labelDropdownRef.current) {
      labelDropdownRef.current.style.display = 'none';
      labelDropdownRef.current.dataset.jobId = '';
    }
  };

  const filteredJobs = Object.entries(jobs).reduce((acc, [columnName, columnJobs]) => {
    const filtered = columnJobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    acc[columnName] = filtered;
    return acc;
  }, { ...jobs });

  const handleCreateJob = () => {
    // Implement job creation logic
    alert('Create Job Card Clicked');
  };

  const openJobModal = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Helmet>
            <title>Job Board | Hoist</title>
            <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
        </Helmet>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Job Board</h1>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search jobs..."
                className="border border-gray-300 rounded p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleCreateJob}
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition duration-300 ease-in-out w-full md:w-auto"
              >
                Create Job Card
              </button>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-full overflow-x-auto pb-6">
              {Object.entries(filteredJobs).map(([columnName, columnJobs]) => (
                <Droppable key={columnName} droppableId={columnName}>
                  {(provided) => (
                    <div
                      className="bg-gray-200 rounded p-4 w-full md:w-80 flex-shrink-0"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                        <span>{columnName.replace('-', ' ').toUpperCase()} ({columnJobs.length})</span>
                        <button className="text-blue-600 text-sm hover:text-blue-800">Filter</button>
                      </h2>
                      <div className="space-y-4">
                        {columnJobs.map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white rounded p-4 shadow hover:shadow-md transition-shadow duration-300 cursor-pointer"
                                onClick={() => openJobModal(job)}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span
                                    className={`${job.labelColor} text-white text-xs font-semibold px-2 py-1 rounded-sm cursor-pointer`}
                                    onClick={(e) => handleLabelClick(e, job.id, job.title)}
                                  >
                                    {job.title}
                                  </span>
                                  <span className="text-xs text-gray-500">{job.jobId}</span>
                                </div>
                                <div className="text-sm font-semibold mb-1">{job.customerName}</div>
                                <div className="text-xs text-gray-600 mb-2">{job.vehicleMake} {job.vehicleModel} ({job.numberPlate})</div>
                                <div className="flex justify-between items-center">
                                  <div className="text-sm font-bold text-green-600">{job.invoiceAmount}</div>
                                  <div className="flex -space-x-2">
                                    {job.assignedEmployees.map((initial, idx) => (
                                      <div
                                        key={idx}
                                        className="h-6 w-6 rounded-full text-white flex items-center justify-center text-xs border-2 border-white"
                                        style={{ backgroundColor: generateColor(initial) }}
                                      >
                                        {initial}
                                      </div>
                                    ))}
                                  </div>
                                </div>
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
      {isJobModalOpen && selectedJob && (
        <JobModal
          isOpen={isJobModalOpen}
          onRequestClose={() => setIsJobModalOpen(false)}
          job={selectedJob}
          onSave={(updatedJob) => {
            console.log('Updated job:', updatedJob);
            setIsJobModalOpen(false);
          }}
        />
      )}
      <div
        ref={labelDropdownRef}
        className="fixed bg-white shadow-lg rounded p-2 z-50 hidden"
        style={{ minWidth: '150px' }}
      >
        <h3 className="font-semibold text-sm mb-2">Change Job Label</h3>
        {labels.map((label) => (
          <button
            key={label.name}
            onClick={() => handleLabelChange(labelDropdownRef.current.dataset.jobId, label)}
            className={`flex items-center space-x-2 p-1 rounded hover:bg-gray-100 w-full text-left ${label.color} text-white mb-1`}
          >
            <span>{label.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;