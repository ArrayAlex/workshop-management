import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
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

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const JobBoard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const labelDropdownRef = useRef(null);

  useClickOutside(labelDropdownRef, () => {
    if (labelDropdownRef.current) {
      labelDropdownRef.current.style.display = 'none';
      labelDropdownRef.current.dataset.jobId = '';
    }
  });

  const filteredJobs = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return Object.entries(jobs).reduce((acc, [columnName, columnJobs]) => {
      acc[columnName] = columnJobs.filter(job =>
        job.title.toLowerCase().includes(lowercasedSearchTerm) ||
        job.jobId.toLowerCase().includes(lowercasedSearchTerm) ||
        job.customerName.toLowerCase().includes(lowercasedSearchTerm)
      );
      return acc;
    }, {});
  }, [jobs, searchTerm]);

  const handleDragEnd = useCallback((result) => {
    const { source, destination } = result;
    if (!destination) return;

    setJobs(prevJobs => {
      const newJobs = { ...prevJobs };
      const sourceColumn = source.droppableId;
      const destColumn = destination.droppableId;
      const sourceJobs = [...newJobs[sourceColumn]];
      const destJobs = sourceColumn === destColumn ? sourceJobs : [...newJobs[destColumn]];
      const [removed] = sourceJobs.splice(source.index, 1);
      destJobs.splice(destination.index, 0, removed);

      newJobs[sourceColumn] = sourceJobs;
      if (sourceColumn !== destColumn) {
        newJobs[destColumn] = destJobs;
      }

      return newJobs;
    });
  }, []);

  const handleLabelClick = useCallback((e, jobId) => {
    e.stopPropagation();
    const dropdown = labelDropdownRef.current;
    if (dropdown) {
      const isCurrentlyVisible = dropdown.style.display === 'block' && dropdown.dataset.jobId === jobId;
      dropdown.style.display = isCurrentlyVisible ? 'none' : 'block';
      dropdown.dataset.jobId = isCurrentlyVisible ? '' : jobId;
      if (!isCurrentlyVisible) {
        const rect = e.target.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  }, []);

  const handleLabelChange = useCallback((jobId, newLabel) => {
    setJobs(prevJobs => {
      const updatedJobs = { ...prevJobs };
      Object.keys(updatedJobs).forEach(columnName => {
        updatedJobs[columnName] = updatedJobs[columnName].map(job =>
          job.id === jobId ? { ...job, title: newLabel.name, labelColor: newLabel.color } : job
        );
      });
      return updatedJobs;
    });
    if (labelDropdownRef.current) {
      labelDropdownRef.current.style.display = 'none';
      labelDropdownRef.current.dataset.jobId = '';
    }
  }, []);

  const handleCreateJob = useCallback(() => {
    console.log('Create Job Card Clicked');
    // Implement job creation logic here
  }, []);

  const openJobModal = useCallback((job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  }, []);

  const closeJobModal = useCallback(() => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  }, []);

  const handleJobUpdate = useCallback((updatedJob) => {
    setJobs(prevJobs => {
      const newJobs = { ...prevJobs };
      Object.keys(newJobs).forEach(columnName => {
        const jobIndex = newJobs[columnName].findIndex(job => job.id === updatedJob.id);
        if (jobIndex !== -1) {
          newJobs[columnName][jobIndex] = updatedJob;
        }
      });
      return newJobs;
    });
    closeJobModal();
  }, [closeJobModal]);

  const generateColor = useCallback((initials) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
      '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#FFD54F'
    ];
    const colorIndex = initials.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  }, []);

  const [sortOption, setSortOption] = useState({
    'to-do': 'newest',
    'in-progress': 'newest',
    'completed': 'newest'
  });

  const handleSort = useCallback((columnName, option) => {
    setSortOption(prev => ({ ...prev, [columnName]: option }));
  }, []);

  const sortedJobs = useMemo(() => {
    return Object.entries(filteredJobs).reduce((acc, [columnName, jobs]) => {
      const sorted = [...jobs].sort((a, b) => {
        switch (sortOption[columnName]) {
          case 'oldest':
            return a.id.localeCompare(b.id);
          case 'newest':
            return b.id.localeCompare(a.id);
          case 'highest':
            return parseFloat(b.invoiceAmount.replace('$', '')) - parseFloat(a.invoiceAmount.replace('$', ''));
          case 'lowest':
            return parseFloat(a.invoiceAmount.replace('$', '')) - parseFloat(b.invoiceAmount.replace('$', ''));
          default:
            return 0;
        }
      });
      acc[columnName] = sorted;
      return acc;
    }, {});
  }, [filteredJobs, sortOption]);

  const renderJobCard = useCallback((job, provided) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-white rounded p-3 shadow-sm hover:shadow transition-shadow duration-300 cursor-pointer border border-gray-200"
      onClick={() => openJobModal(job)}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={`${job.labelColor} text-white text-xs font-semibold px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity duration-300`}
          onClick={(e) => handleLabelClick(e, job.id)}
        >
          {job.title}
        </span>
        <span className="text-xs font-small text-blue-600">#{job.jobId}</span>
      </div>
      <div className="text-sm font-semibold mb-1 text-gray-800">{job.customerName}</div>
      <div className="text-xs text-gray-600 mb-2 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        {job.vehicleMake} {job.vehicleModel} ({job.numberPlate})
      </div>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-1">
          {job.assignedEmployees.map((initial, idx) => (
            <div
              key={idx}
              className="h-6 w-6 rounded-full text-white flex items-center justify-center text-xs font-medium border border-white shadow-sm"
              style={{ backgroundColor: generateColor(initial) }}
            >
              {initial}
            </div>
          ))}
        </div>
        <div className="text-xs font-medium text-gray-500">{job.invoiceAmount}</div>
      </div>
    </div>
  ), [generateColor, handleLabelClick, openJobModal]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Helmet>
        <title>Job Board | Hoist</title>
        <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
      </Helmet>
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full md:w-64 pl-8 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <button
                onClick={handleCreateJob}
                className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out w-full md:w-auto flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
                Create Job Card
              </button>
            </div>
          </div>
        </div>
      </header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className="flex h-full">
            {Object.entries(sortedJobs).map(([columnName, columnJobs]) => (
              <Droppable key={columnName} droppableId={columnName}>
                {(provided) => (
                  <section
                    className="flex-1 min-w-[300px] bg-gray-50 border-r border-gray-200 last:border-r-0 flex flex-col"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="p-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {columnName.replace('-', ' ')} ({columnJobs.length})
                      </h2>
                      <select
                        className="text-xs bg-white border border-gray-300 rounded px-1 py-0.5"
                        value={sortOption[columnName]}
                        onChange={(e) => handleSort(columnName, e.target.value)}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="highest">Highest $</option>
                        <option value="lowest">Lowest $</option>
                      </select>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {columnJobs.map((job, index) => (
                        <Draggable key={job.id} draggableId={job.id} index={index}>
                          {(provided) => renderJobCard(job, provided)}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </section>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
      {isJobModalOpen && selectedJob && (
        <JobModal
          isOpen={isJobModalOpen}
          onRequestClose={closeJobModal}
          job={selectedJob}
          onSave={handleJobUpdate}
        />
      )}
      <div
        ref={labelDropdownRef}
        className="fixed bg-white shadow-lg rounded p-2 z-50 hidden"
        style={{ minWidth: '150px' }}
      >
        <h3 className="font-semibold text-xs mb-2 text-gray-700">Change Job Label</h3>
        {labels.map((label) => (
          <button
            key={label.name}
            onClick={() => handleLabelChange(labelDropdownRef.current.dataset.jobId, label)}
            className={`flex items-center space-x-2 p-1.5 rounded hover:bg-gray-100 w-full text-left ${label.color} text-white mb-1 transition-colors duration-200`}
          >
            <span>{label.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(JobBoard);