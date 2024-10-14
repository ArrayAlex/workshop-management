import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import BookingModal from '../BookingModal/BookingModal';
import './Calendar.css';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, List } from 'lucide-react';
import { Helmet } from 'react-helmet';
import EventHoverDialog from './EventHoverDialog';
import axiosInstance from '../../api/axiosInstance';

const WORK_DAY_START = '07:00:00';
const WORK_DAY_END = '18:00:00';
const WORKING_HOURS = 11; // Calculated from 07:00 to 18:00

const Calendar = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [capacityData, setCapacityData] = useState({});
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoverEvent, setHoverEvent] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const calendarRef = useRef(null);
  // const [events, setEvents] = useState([
  //   { 
  //     id: '1', 
  //     title: 'Job 1020 - Princess Leia', 
  //     start: new Date('2024-10-17T08:00:00'), 
  //     end: new Date('2024-10-17T09:00:00'), 
  //     technicians: ['R2-D2', 'Luke'], 
  //     description: 'Escape pod installation', 
  //     jobStatus: 'Booked', 
  //     pickup: new Date('2024-10-10T17:00:00'),
  //     extendedProps: { jobId: '1020' }
  //   },
  //   { 
  //     id: '2', 
  //     title: 'Job 1021 - Han Solo', 
  //     start: new Date('2024-10-14T09:00:00'), 
  //     end: new Date('2024-10-14T10:00:00'), 
  //     technicians: ['Chewbacca'], 
  //     description: 'Falcon repairs', 
  //     jobStatus: 'In Progress',  
  //     pickup: new Date('2024-10-14T18:00:00'),
  //     extendedProps: { jobId: '1023' }
  //   },
  //   { 
  //     id: '5', 
  //     title: 'Job 1021 - Han Solo', 
  //     start: new Date('2024-10-15T09:00:00'), 
  //     end: new Date('2024-10-15T10:00:00'), 
  //     technicians: ['Peter'], 
  //     description: 'Engine Swap', 
  //     jobStatus: 'Completed', 
  //     pickup: new Date('2024-10-11T18:00:00'),
  //     extendedProps: { jobId: '1022' }
  //   },
  //   { 
  //     id: '4', 
  //     title: 'Job 1021 - Han Solo', 
  //     start: new Date('2024-10-15T09:00:00'), 
  //     end: new Date('2024-10-15T10:00:00'), 
  //     technicians: ['Peter'], 
  //     description: 'Wheel Alignment', 
  //     jobStatus: 'Cancelled', 
  //     pickup: new Date('2024-10-11T18:00:00'),
  //     extendedProps: { jobId: '1024' }
  //   },
  //   { 
  //     id: '6', 
  //     title: 'Job 1021 - Han Solo', 
  //     start: new Date('2024-10-16T09:00:00'), 
  //     end: new Date('2024-10-16T10:00:00'), 
  //     technicians: ['Chewbacca'], 
  //     description: 'Falcon repairs', 
  //     jobStatus: 'In Progress', 
  //     pickup: new Date('2024-10-16T18:00:00'),
  //     extendedProps: { jobId: '1025' }
  //   },
  // ]);



  



  const getCapacityColor = (freeHoursPercentage) => {
    const percentage = parseFloat(freeHoursPercentage);
    if (percentage < 20) return 'red';
    if (percentage < 40) return 'orange';
    return 'green';
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

  const handleMouseMove = useCallback((e) => {
    if (isHovering && hoverEvent) {
      setHoverPosition({ x: e.clientX + 10, y: e.clientY + 10 });
    }
  }, [isHovering, hoverEvent]);
  
  const fetchAppointments = useCallback(async (start, end) => {
    setIsLoading(true);
    setError(null);
    try {
      const startDate = start.toISOString();
      const endDate = end.toISOString();

      console.log(`Fetching appointments between ${startDate} and ${endDate}`);

      const response = await axiosInstance.get('/Appointment/Appointments', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      
      console.log('Response data:', response.data);

      const formattedEvents = response.data.map(booking => ({
        id: booking.id,
        title: `${booking.customer.name} - ${booking.vehicle.make} ${booking.vehicle.model}`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        notes: booking.notes || '',
        backgroundColor: booking.bookingStatus?.color || '#6495ED',
        borderColor: booking.bookingStatus?.color || '#6495ED',
        textColor: '#ffffff',
        extendedProps: {
          bookingId: booking.id,
          bookingStatus: booking.bookingStatus?.title || 'Unknown',
          jobs: JSON.parse(booking.jobs || '[]'),
          active: booking.active,
          lastModified: booking.lastModified,
          invoiceId: booking.invoiceID,
          customer: booking.customer,
          vehicle: booking.vehicle
        }
      }));

      console.log('Fetched and formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDatesSet = useCallback((dateInfo) => {
    const { start, end } = dateInfo;
    fetchAppointments(start, end);
    updateCapacityData();
  }, [fetchAppointments, updateCapacityData]);

  useEffect(() => {
    // Initial fetch of appointments when component mounts
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const start = calendarApi.view.activeStart;
      const end = calendarApi.view.activeEnd;
      fetchAppointments(start, end);
    }
  }, [fetchAppointments]);

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
      id: event.id,
      title: event.title,
      start_time: event.start,
      end_time: event.end,
      description: event.extendedProps.description || '',
      notes: event.extendedProps.notes || '',
      bookingStatus: event.extendedProps.bookingStatus,
      customer: event.extendedProps.customer,
      vehicle: event.extendedProps.vehicle,
      jobs: event.extendedProps.jobs,
      invoiceId: event.extendedProps.invoiceId,
      technicians: event.extendedProps.technicians || [],
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditedEvent(null);
  };

  const handleDateClick = (info) => {
    
  };

  const handleEventClick = (info) => {
    openModal(info);
  };


  const handleDateSelect = (selectInfo) => {
    setEditedEvent({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
      // Initialize other fields as needed
      title: '',
      technicians: [],
      description: '',
      jobStatus: 'Booked',
      pickup: null,
      extendedProps: { jobId: '' }
    });
    setIsOpen(true);
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
      <div className="custom-toolbar bg-white-400 text-gray-520 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handlePrev} className="p-2 bg-blue-500 text-white rounded-sm hover:bg-gray-600">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-2 bg-blue-500 rounded-sm text-white hover:bg-gray-600">
            <ChevronRight size={24} />
          </button>
          <button onClick={handleToday} className="px-4 py-2 bg-blue-500 rounded-sm text-white hover:bg-gray-600">
            Today
          </button>
        </div>
        <div className="text-2xl font-bold">
          Workshop Calendar
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => handleViewChange('timeGridWeek')} className="flex items-center space-x-2 p-2 bg-blue-500 rounded-sm text-white hover:bg-gray-600">
            <CalendarIcon size={20} />
            <span>Week</span>
          </button>
          <button onClick={() => handleViewChange('timeGridDay')} className="flex items-center space-x-2 p-2 bg-blue-500 rounded-sm text-white hover:bg-gray-600">
            <Clock size={20} />
            <span>Day</span>
          </button>
          <button onClick={() => handleViewChange('listWeek')} className="flex items-center space-x-2 p-2 bg-blue-500 rounded-sm text-white hover:bg-gray-600">
            <List size={20} />
            <span>List</span>
          </button>
        </div>
      </div>
    );
  };

  const handleSave = async (updatedEvent) => {
    try {
      let response;
      if (updatedEvent.id) {
        // Update existing event
        response = await axiosInstance.put('/Appointment/update', updatedEvent);
      } else {
        // Add new event
        response = await axiosInstance.post('/Appointment/add', updatedEvent);
      }

      if (response.data === true) {
        // Refresh the calendar data
        const calendarApi = calendarRef.current.getApi();
        fetchAppointments(calendarApi.view.activeStart, calendarApi.view.activeEnd);
      } else {
        throw new Error('Operation failed');
      }
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError('Failed to save the appointment. Please try again.');
    }
    closeModal();
  };

 

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
    const bookingId = event.extendedProps.bookingId;
    const bookingStatus = event.extendedProps.bookingStatus;
    const jobs = event.extendedProps.jobs;
    const customer = event.extendedProps.customer;
    const vehicle = event.extendedProps.vehicle;
    
    const durationInMinutes = (event.end - event.start) / (1000 * 60);
    const isShort = durationInMinutes <= 30;
    
    return (
      <div 
        className={`event-container booking-${bookingStatus.toLowerCase().replace(' ', '-')} ${isShort ? 'short-event' : ''}`}
        style={{ backgroundColor: event.backgroundColor }}
        onMouseEnter={(e) => handleEventMouseEnter({ event: eventInfo.event, jsEvent: e })}
        onMouseLeave={handleEventMouseLeave}
      >
        <div className="event-header">
          <span className="event-id">#{bookingId}</span>
          {!isShort && <span className="event-time">{eventInfo.timeText}</span>}
        </div>
        {!isShort && (
          <div className="event-body">
            <div className="event-title">{event.title}</div>
            <div className="event-customer">{customer.name} - {customer.phone}</div>
            <div className="event-vehicle">{vehicle.make} {vehicle.model} ({vehicle.rego})</div>
            <div className="event-status">{bookingStatus}</div>
            {jobs && jobs.length > 0 && (
              <div className="job-icons">
                {jobs.map((jobId, index) => (
                  <span 
                    key={index} 
                    className="job-icon" 
                    title={`Job ${jobId}`}
                    style={{ backgroundColor: generateColor(jobId.toString()) }}
                  >
                    {jobId}
                  </span>
                ))}
              </div>
            )}
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
    <div className="flex-1 relative overflow-hidden">
      <Helmet>
        <title>Diary | Hoist</title>
        <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
      </Helmet>
      <CustomToolbar calendarRef={calendarRef} />
      {isLoading && <div className="loading-overlay">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
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
        datesSet={handleDatesSet}
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
        select={handleDateSelect}
      />
      {isHovering && hoverEvent && (
        <EventHoverDialog 
          event={hoverEvent} 
          position={hoverPosition} 
          onMouseEnter={handleDialogMouseEnter}
          onMouseLeave={handleDialogMouseLeave}
        />
      )}

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