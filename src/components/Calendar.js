import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BookingModal from './BookingModal';
import './Calendar.css';

const WORK_DAY_START = '07:00:00';
const WORK_DAY_END = '18:00:00';
const WORKING_HOURS = 11; // Calculated from 07:00 to 18:00

const Calendar = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState(null);
  const [capacityData, setCapacityData] = useState({});
  const [events, setEvents] = useState([
    { 
      id: '1', 
      title: 'Job 1020 - Princess Leia', 
      start: new Date('2024-10-10T08:00:00'), 
      end: new Date('2024-10-10T09:00:00'), 
      technicians: ['R2-D2', 'Luke'], 
      description: 'Escape pod installation', 
      jobStatus: 'Booked', 
      pickup: new Date('2024-10-10T17:00:00'),
      extendedProps: { jobId: '1020' }
    },
    { 
      id: '2', 
      title: 'Job 1021 - Han Solo', 
      start: new Date('2024-10-11T09:00:00'), 
      end: new Date('2024-10-11T10:00:00'), 
      technicians: ['Chewbacca'], 
      description: 'Falcon repairs', 
      jobStatus: 'In Progress', 
      pickup: new Date('2024-10-11T18:00:00'),
      extendedProps: { jobId: '1021' }
    },
  ]);

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
  const calendarRef = useRef(null);

  const openModal = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setEditedEvent({
      ...eventInfo.event.extendedProps,
      id: eventInfo.event.id,
      title: eventInfo.event.title,
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      technicians: eventInfo.event.extendedProps.technicians.map(tech => ({ value: tech, label: tech })),
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
      return total + jobDuration; // Remove multiplication by technician count
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
    const jobId = eventInfo.event.extendedProps.jobId;
    const jobStatus = eventInfo.event.extendedProps.jobStatus.toLowerCase().replace(' ', '-');
    
    return (
      <div className={`event-container job-${jobStatus}`}>
        <div className="event-header">
          <span className="event-time">{eventInfo.timeText}</span>
          <span className="event-id">#{jobId}</span>
        </div>
        <div className="event-body">
          <div className="event-title">{eventInfo.event.title}</div>
          <div className="technician-icons">
            {eventInfo.event.extendedProps.technicians.map((tech, index) => {
              const initials = tech.split(' ').map(name => name[0]).join('');
              const backgroundColor = generateColor(initials);
              return (
                <span 
                  key={index} 
                  className="technician-icon" 
                  title={tech}
                  style={{ backgroundColor }}
                >
                  {initials}
                </span>
              );
            })}
          </div>
        </div>
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
          <h2 className="font-semibold text-2xl mb-4">Workshop Calendar</h2>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, momentPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay,listWeek'
            }}
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
          />
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