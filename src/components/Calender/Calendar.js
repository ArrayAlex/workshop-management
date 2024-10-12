import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import BookingModal from '../BookingModal/BookingModal';
import './Calendar.css';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, List } from 'lucide-react';

const WORK_DAY_START = '07:00:00';
const WORK_DAY_END = '18:00:00';
const WORKING_HOURS = 11; // Calculated from 07:00 to 18:00

const EventHoverDialog = ({ event, position, onMouseEnter, onMouseLeave }) => {
  const dialogRef = useRef(null);
  const [dialogDimensions, setDialogDimensions] = useState({ width: 0, height: 0 });
  const [finalPosition, setFinalPosition] = useState(position);

  useEffect(() => {
    if (dialogRef.current) {
      const { offsetWidth, offsetHeight } = dialogRef.current;
      setDialogDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [event]); // Recalculate when the event changes

  useEffect(() => {
    if (dialogDimensions.width && dialogDimensions.height) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Flip horizontally if too close to the right edge
      if (position.x + dialogDimensions.width > windowWidth) {
        newX = position.x - dialogDimensions.width - 20; // 20px offset from cursor
      }

      // Flip vertically if too close to the bottom edge
      if (position.y + dialogDimensions.height > windowHeight) {
        newY = position.y - dialogDimensions.height - 20; // 20px offset from cursor
      }

      setFinalPosition({ x: newX, y: newY });
    }
  }, [position, dialogDimensions]);

  if (!event) return null;

  return (
    <div 
      ref={dialogRef}
      className="event-hover-dialog" 
      style={{ 
        position: 'fixed', 
        top: finalPosition.y,
        left: finalPosition.x,
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minWidth: '200px', // Set a minimum width to prevent squeezing
        maxWidth: '300px', // Set a maximum width for consistency
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3>{event.title}</h3>
      <p>Job ID: {event.extendedProps.jobId}</p>
      <p>Status: {event.extendedProps.jobStatus}</p>
      <p>Time: {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}</p>
      <p>Description: {event.extendedProps.description}</p>
      <p>Technicians: {event.extendedProps.technicians.join(', ')}</p>
      <p>Pickup: {event.extendedProps.pickup.toLocaleString()}</p>
    </div>
  );
};

const Calendar = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  //const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [capacityData, setCapacityData] = useState({});
  const [events, setEvents] = useState([
    { 
      id: '1', 
      title: 'Job 1020 - Princess Leia', 
      start: new Date('2024-10-17T08:00:00'), 
      end: new Date('2024-10-17T09:00:00'), 
      technicians: ['R2-D2', 'Luke'], 
      description: 'Escape pod installation', 
      jobStatus: 'Booked', 
      pickup: new Date('2024-10-10T17:00:00'),
      extendedProps: { jobId: '1020' }
    },
    { 
      id: '2', 
      title: 'Job 1021 - Han Solo', 
      start: new Date('2024-10-14T09:00:00'), 
      end: new Date('2024-10-14T10:00:00'), 
      technicians: ['Chewbacca'], 
      description: 'Falcon repairs', 
      jobStatus: 'In Progress', 
      pickup: new Date('2024-10-14T18:00:00'),
      extendedProps: { jobId: '1023' }
    },
    { 
      id: '5', 
      title: 'Job 1021 - Han Solo', 
      start: new Date('2024-10-15T09:00:00'), 
      end: new Date('2024-10-15T10:00:00'), 
      technicians: ['Peter'], 
      description: 'Engine Swap', 
      jobStatus: 'Completed', 
      pickup: new Date('2024-10-11T18:00:00'),
      extendedProps: { jobId: '1022' }
    },
    { 
      id: '4', 
      title: 'Job 1021 - Han Solo', 
      start: new Date('2024-10-15T09:00:00'), 
      end: new Date('2024-10-15T10:00:00'), 
      technicians: ['Peter'], 
      description: 'Wheel Alignment', 
      jobStatus: 'Cancelled', 
      pickup: new Date('2024-10-11T18:00:00'),
      extendedProps: { jobId: '1024' }
    },
    { 
      id: '6', 
      title: 'Job 1021 - Han Solo', 
      start: new Date('2024-10-16T09:00:00'), 
      end: new Date('2024-10-16T10:00:00'), 
      technicians: ['Chewbacca'], 
      description: 'Falcon repairs', 
      jobStatus: 'In Progress', 
      pickup: new Date('2024-10-16T18:00:00'),
      extendedProps: { jobId: '1025' }
    },
  ]);

  const [hoverEvent, setHoverEvent] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (isHovering && hoverEvent) {
      setHoverPosition({ x: e.clientX + 10, y: e.clientY + 10 });
    }
  }, [isHovering, hoverEvent]);

  const calendarRef = useRef(null);

  const getCapacityColor = (freeHoursPercentage) => {
    const percentage = parseFloat(freeHoursPercentage);
    if (percentage < 20) return 'red';
    if (percentage < 40) return 'orange';
    return 'green';
  };

  const [technicians] = useState([
    { value: 'R2-D2', label: 'R2-D2' },
    { value: 'C-3PO', label: 'C-3PO' },
    { value: 'Chewbacca', label: 'Chewbacca' },
    { value: 'Luke', label: 'Luke' },
    { value: 'Alex', label: 'Alex' },
    { value: 'Bryan', label: 'Bryan' },
    { value: 'Peter', label: 'Peter' },
    { value: 'Stewie', label: 'Stewie' },
  ]);


  const handleEventMouseEnter = useCallback((mouseEnterInfo) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
    setHoverEvent(mouseEnterInfo.event);
    setHoverPosition({
      x: mouseEnterInfo.jsEvent.clientX + 10,
      y: mouseEnterInfo.jsEvent.clientY + 10,
    });
  }, []);

  const handleEventMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setHoverEvent(null);
    }, 100); // Small delay to allow moving to the dialog
  }, []);


  const handleDialogMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
  }, []);

  const handleDialogMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setHoverEvent(null);
    }, 100);
  }, []);


  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleMouseMove); // Re-position on window resize

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const openModal = (eventInfo) => {
    const event = eventInfo.event;
    setEditedEvent({
      ...event.extendedProps,
      id: event.id,
      title: event.title,
      start: event.start ? new Date(event.start) : null,
      end: event.end ? new Date(event.end) : null,
      pickup: event.extendedProps.pickup ? new Date(event.extendedProps.pickup) : null,
      technicians: event.extendedProps.technicians.map(tech => ({ value: tech, label: tech })),
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditedEvent(null);
  };

  const handleDateClick = (info) => {
    alert(`Clicked on date: ${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    openModal(info);
  };

  const CustomToolbar = ({ calendarRef }) => {
    const handlePrev = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    };
  
    const handleNext = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    };
  
    const handleToday = () => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    };
  
    const handleViewChange = (view) => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
    };
  
    return (
      <div className="custom-toolbar bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handlePrev} className="p-2 bg-gray-700 rounded hover:bg-gray-600">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-2 bg-gray-700 rounded hover:bg-gray-600">
            <ChevronRight size={24} />
          </button>
          <button onClick={handleToday} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
            Today
          </button>
        </div>
        <div className="text-2xl font-bold">
          Workshop Calendar
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => handleViewChange('timeGridWeek')} className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600">
            <CalendarIcon size={20} />
            <span>Week</span>
          </button>
          <button onClick={() => handleViewChange('timeGridDay')} className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600">
            <Clock size={20} />
            <span>Day</span>
          </button>
          <button onClick={() => handleViewChange('listWeek')} className="flex items-center space-x-2 p-2 bg-gray-700 rounded hover:bg-gray-600">
            <List size={20} />
            <span>List</span>
          </button>
        </div>
      </div>
    );
  };

  const handleSave = (updatedEvent) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedEvent.id ? { 
        ...event, 
        ...updatedEvent, 
        technicians: updatedEvent.technicians.map(tech => tech.value)
      } : event
    ));
    closeModal();
  };

  const calculateCapacity = useCallback((date) => {
    const jobsToday = events.filter(event => 
      new Date(event.start).toDateString() === new Date(date).toDateString()
    );

    if (jobsToday.length === 0) {
      return { jobs: 0, freeHours: WORKING_HOURS, freeHoursPercentage: '100.0' };
    }
    
    const bookedHours = jobsToday.reduce((total, job) => {
      const jobStart = new Date(job.start);
      const jobEnd = new Date(job.end);
      const jobDuration = (jobEnd - jobStart) / (1000 * 60 * 60);
      return total + jobDuration;
    }, 0);

    const freeHours = Math.max(0, WORKING_HOURS - bookedHours);
    const freeHoursPercentage = ((freeHours / WORKING_HOURS) * 100).toFixed(1);

    return { jobs: jobsToday.length, freeHours, freeHoursPercentage };
  }, [events]);

  const updateCapacityData = useCallback(() => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    const currentView = calendarApi.view;
    const viewStart = currentView.activeStart;
    const viewEnd = currentView.activeEnd;

    const newCapacityData = {};
    for (let date = new Date(viewStart); date < viewEnd; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      newCapacityData[dateStr] = calculateCapacity(new Date(date));
    }

    setCapacityData(newCapacityData);
  }, [calculateCapacity]);

  useEffect(() => {
    updateCapacityData();
  }, [events, updateCapacityData]);

  const renderDayHeaderContent = (arg) => {
    const dateStr = arg.date.toISOString().split('T')[0];
    const capacity = capacityData[dateStr] || { jobs: 0, freeHours: WORKING_HOURS, freeHoursPercentage: '100.0' };
    const capacityColor = getCapacityColor(capacity.freeHoursPercentage);

    return (
      <div>
        <h2 style={{ fontSize: '14px', margin: '0' }}>{arg.text}</h2>
        <div className="capacity-info">
          <h4 style={{ fontSize: '12px', margin: '0' }}>Jobs: {capacity.jobs}</h4>
          <h5 style={{ fontSize: '10px', margin: '0', color: capacityColor }}>
            Free: {capacity.freeHours.toFixed(2)}h ({capacity.freeHoursPercentage}%)
          </h5>
        </div>
      </div>
    );
  };

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const jobId = event.extendedProps.jobId;
    const jobStatus = event.extendedProps.jobStatus.toLowerCase().replace(' ', '-');
    
    const durationInMinutes = (event.end - event.start) / (1000 * 60);
    const isShort = durationInMinutes <= 30;
    
    return (
      <div 
        className={`event-container job-${jobStatus} ${isShort ? 'short-event' : ''}`}
        onMouseEnter={(e) => handleEventMouseEnter({ event: eventInfo.event, jsEvent: e })}
        onMouseLeave={handleEventMouseLeave}
      >
        <div className="event-header">
          <span className="event-id">#{jobId}</span>
          {!isShort && <span className="event-time">{eventInfo.timeText}</span>}
        </div>
        {!isShort && (
          <div className="event-body">
            <div className="event-title">{event.title}</div>
            <div className="technician-icons">
              {event.extendedProps.technicians.map((tech, index) => {
                const initials = tech.split(' ').map(name => name[0]).join('');
                return (
                  <span 
                    key={index} 
                    className="technician-icon" 
                    title={tech}
                    style={{ backgroundColor: generateColor(initials) }}
                  >
                    {initials}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const generateColor = (initials) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
      '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#FFD54F'
    ];
    
    const colorIndex = initials.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const handleEventChange = (changeInfo) => {
    setEvents(prevEvents => prevEvents.map(event =>
      event.id === changeInfo.event.id
        ? {
            ...event,
            start: changeInfo.event.start,
            end: changeInfo.event.end,
          }
        : event
    ));
  };

  return (
    <div className="flex flex-col h-screen bg-white-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-5 relative overflow-hidden">
          
          <CustomToolbar calendarRef={calendarRef} />
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, momentPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            nowIndicator={true}
            editable={true}
            droppable={true}
            selectable={true}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            datesSet={updateCapacityData}
            slotMinTime={WORK_DAY_START}
            slotMaxTime={WORK_DAY_END}
            scrollTime={WORK_DAY_START}
            height="auto"
            dayMaxEvents={true}
            dayHeaderContent={renderDayHeaderContent}
            eventContent={renderEventContent}
            allDaySlot={false} 
            
            eventMouseEnter={handleEventMouseEnter}
            eventMouseLeave={handleEventMouseLeave}
          />
          {isHovering && hoverEvent && (
        <EventHoverDialog 
          event={hoverEvent} 
          position={hoverPosition} 
          onMouseEnter={handleDialogMouseEnter}
          onMouseLeave={handleDialogMouseLeave}
        />
      )}
        </div>
      </div>

      <BookingModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        editedEvent={editedEvent}
        onSave={handleSave}
        technicians={technicians}
      />
    </div>
  );
};

export default Calendar;