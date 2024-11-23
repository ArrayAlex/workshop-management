import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import JobModal from '../JobModal/JobsModal';
import axiosInstance from "../../api/axiosInstance";
import {Helmet} from 'react-helmet';
import { FaCar } from 'react-icons/fa';

const labels = [
    {name: 'Appt Confirmed', color: 'bg-red-500'},
    {name: 'Waiting On Approval', color: 'bg-yellow-500'},
    {name: 'Work Completed', color: 'bg-green-500'},
    {name: 'Called Customer', color: 'bg-blue-500'},
];

const handleDragStart = (start) => {
    console.log("Dragging started:");
    console.log("Dragged jobId:", start.draggableId);
};
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
    const [jobs, setJobs] = useState({
        'to-do': [],
        'in-progress': [],
        'completed': []
    });
    const [searchTerm, setSearchTerm] = useState(''); // Track search input
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const labelDropdownRef = useRef(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get('/Job/jobs');
                const fetchedJobs = response.data;

                // Categorize jobs based on their jobBoardID
                const categorizedJobs = fetchedJobs.reduce((acc, job) => {
                    switch (job.jobBoardID) {
                        case 0:
                            acc['to-do'].push(job);
                            break;
                        case 1:
                            acc['in-progress'].push(job);
                            break;
                        case 2:
                            acc['completed'].push(job);
                            break;
                        default:
                            // Default to 'to-do' for any other status
                            acc['to-do'].push(job);
                    }
                    return acc;
                }, { 'to-do': [], 'in-progress': [], 'completed': [] });

                setJobs(categorizedJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

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
                // Check job status description
                (job.jobStatus && job.jobStatus.description && job.jobStatus.description.toLowerCase().includes(lowercasedSearchTerm)) ||
                // Check job ID
                job.jobId.toString().includes(lowercasedSearchTerm) ||
                // Check customer name
                (job.customer && job.customer.name && job.customer.name.toLowerCase().includes(lowercasedSearchTerm)) ||
                // Check vehicle rego
                (job.vehicle && job.vehicle.rego && job.vehicle.rego.toLowerCase().includes(lowercasedSearchTerm))
            );
            return acc;
        }, {});
    }, [jobs, searchTerm]);

    const handleSearchChange = (e) => {
        console.log(e);
        setSearchTerm(e.target.value);
    };

    const handleDragEnd = useCallback(async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceColumn = source.droppableId;
        const destColumn = destination.droppableId;
        const jobBoardIDMap = {
            'to-do': 0,
            'in-progress': 1,
            'completed': 2
        };
        const newJobBoardID = jobBoardIDMap[destColumn];



        setJobs(prevJobs => {
            const newJobs = { ...prevJobs };
            const sourceJobs = [...newJobs[sourceColumn]];
            const destJobs = destColumn === sourceColumn ? sourceJobs : [...newJobs[destColumn]];

            // Find the index of the job in the source column
            const sourceIndex = sourceJobs.findIndex(option => option.jobId == result.draggableId);
            if (sourceIndex === -1) {
                console.error('Job not found in source column');
                return prevJobs;
            }



            // Remove the job from the source array
            const [removed] = sourceJobs.splice(sourceIndex, 1);

            // Create updated job with new board ID
            const updatedJob = {
                ...removed,
                jobBoardID: newJobBoardID,
            };

            // Insert the job at the destination
            destJobs.splice(destination.index, 0, updatedJob);

            // Update both columns
            newJobs[sourceColumn] = sourceJobs;
            if (sourceColumn !== destColumn) {
                newJobs[destColumn] = destJobs;
            }

            return newJobs;
        });

        // Send the updated job status to the backend
        try {
            await axiosInstance.put(`/Job/jobboardid/${result.draggableId}`, newJobBoardID, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response = await axiosInstance.get('/Job/jobs');
            const fetchedJobs = response.data;
            const categorizedJobs = fetchedJobs.reduce((acc, job) => {
                switch (job.jobBoardID) {
                    case 0:
                        acc['to-do'].push(job);
                        break;
                    case 1:
                        acc['in-progress'].push(job);
                        break;
                    case 2:
                        acc['completed'].push(job);
                        break;
                    default:
                        acc['to-do'].push(job);
                }
                return acc;
            }, { 'to-do': [], 'in-progress': [], 'completed': [] });

            setJobs(categorizedJobs);
        } catch (error) {
            console.error('Error updating job status:', error);
            // Optionally, you might want to revert the UI state here if the backend update fails
        }
    }, []);


    const handleLabelClick = useCallback((e, jobId) => {
        e.stopPropagation();
        const dropdown = labelDropdownRef.current;
        if (dropdown) {
            const isCurrentlyVisible = dropdown.style.display === 'block' && dropdown.dataset.jobId === jobId.toString();
            dropdown.style.display = isCurrentlyVisible ? 'none' : 'block';
            dropdown.dataset.jobId = isCurrentlyVisible ? '' : jobId.toString();
            if (!isCurrentlyVisible) {
                const rect = e.target.getBoundingClientRect();
                dropdown.style.top = `${rect.bottom + window.scrollY}px`;
                dropdown.style.left = `${rect.left + window.scrollX}px`;
            }
        }
    }, []);

    const handleLabelChange = useCallback((jobId, newStatus) => {
        setJobs(prevJobs => {
            const updatedJobs = {...prevJobs};
            Object.keys(updatedJobs).forEach(columnName => {
                const jobIndex = updatedJobs[columnName].findIndex(job => job.jobId === jobId);
                if (jobIndex !== -1) {
                    const job = updatedJobs[columnName][jobIndex];
                    updatedJobs[columnName][jobIndex] = {
                        ...job,
                        jobStatus: newStatus
                    };
                }
            });
            return updatedJobs;
        });
        if (labelDropdownRef.current) {
            labelDropdownRef.current.style.display = 'none';
            labelDropdownRef.current.dataset.jobId = '';
        }
    }, []);

    const handleCreateJob = useCallback(() => {
        setSelectedJob(null); // No job selected for a new job
        setIsJobModalOpen(true); // Open the modal
    }, []);

    const openJobModal = useCallback((job, event) => {
        if (event) {
            event.stopPropagation(); // Prevent triggering the label dropdown
        }
        setSelectedJob(job); // Set the selected job to be displayed in the modal
        setIsJobModalOpen(true); // Open the job modal
    }, []);


    const closeJobModal = useCallback(() => {
        setIsJobModalOpen(false);
        setSelectedJob(null);
    }, []);

    const handleJobUpdate = useCallback((updatedJob) => {
        setJobs(prevJobs => {
            const newJobs = {...prevJobs};
            Object.keys(newJobs).forEach(columnName => {
                const jobIndex = newJobs[columnName].findIndex(job => job.jobId === updatedJob.jobId);
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
        setSortOption(prev => ({...prev, [columnName]: option}));
    }, []);

    const sortedJobs = useMemo(() => {
        return Object.entries(filteredJobs).reduce((acc, [columnName, columnJobs]) => {
            const sorted = [...columnJobs].sort((a, b) => {
                switch (sortOption[columnName]) {
                    case 'newest':
                        // First compare by updatedAt dates
                        const dateCompare = new Date(b.updatedAt) - new Date(a.updatedAt);
                        // If dates are equal, sort by jobId (highest first)
                        return dateCompare === 0 ? b.jobId - a.jobId : dateCompare;

                    case 'oldest':
                        const oldestDateCompare = new Date(a.updatedAt) - new Date(b.updatedAt);
                        // If dates are equal, sort by jobId (highest first)
                        return oldestDateCompare === 0 ? b.jobId - a.jobId : oldestDateCompare;

                    case 'highest':
                        return (b.invoiceAmount || 0) - (a.invoiceAmount || 0);

                    case 'lowest':
                        return (a.invoiceAmount || 0) - (b.invoiceAmount || 0);

                    default:
                        // Default to newest first
                        const defaultDateCompare = new Date(b.updatedAt) - new Date(a.updatedAt);
                        return defaultDateCompare === 0 ? b.jobId - a.jobId : defaultDateCompare;
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
                    className="text-white text-xs font-semibold px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity duration-300"
                    style={{backgroundColor: job.jobStatus.color}}
                    onClick={(e) => handleLabelClick(e, job.jobId)}
                >
                    {job.jobStatus.title}
                </span>
                <span className="text-xs font-small text-blue-600">#{job.jobId}</span>
            </div>
            <div className="text-sm font-semibold mb-1 text-gray-800">
                {job.customer ? `${job.customer.firstName} ${job.customer.lastName}` : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 mb-2 flex items-center">
                <FaCar className="text-gray-600 mr-1"/>
                {job.vehicle ? `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.rego})` : 'N/A'}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex -space-x-1">
                    {job.technician && (
                        <div
                            className="h-6 w-6 rounded-full text-white flex items-center justify-center text-xs font-medium border border-white shadow-sm"
                            style={{backgroundColor: generateColor(job.technician.name)}}
                        >
                            {job.technician.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="text-xs font-medium text-gray-500">{job.invoiceAmount || 'N/A'}</div>
            </div>
        </div>
    ), [generateColor, handleLabelClick, openJobModal]);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Helmet>
                <title>Job Board | Hoist</title>
                <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png"/>
            </Helmet>
            <header className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <h1 className="text-2xl font-bold text-gray-500">Job Board</h1>
                        <div
                            className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search job #ID or rego..."
                                    className="w-full md:w-64 pl-8 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <svg
                                    className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2"
                                    fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <button
                                onClick={handleCreateJob}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300"
                            >
                                Create Job
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
                                        <div
                                            className="p-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
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

                                                <Draggable key={job.jobId} draggableId={job.jobId.toString()} index={index}>
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
            {isJobModalOpen && (
                <JobModal
                    isOpen={isJobModalOpen}
                    onClose={closeJobModal}
                    job={selectedJob}

                    // Pass other necessary props like technicians, customers, vehicles
                />
            )}
            <div
                ref={labelDropdownRef}
                className="fixed bg-white shadow-lg rounded p-2 z-50 hidden"
                style={{minWidth: '150px'}}
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