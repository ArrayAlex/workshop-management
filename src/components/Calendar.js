// src/components/Calendar.js
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // enables drag and drop
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import Modal from 'react-modal';
import Navbar from './Navbar'; // Import Navbar
import Sidebar from './Sidebar'; // Import Sidebar
import './Calendar.css'; // Import your CSS file

const Calendar = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([
    { id: '1', title: 'Client Meeting', start: '2024-10-10T10:30:00', end: '2024-10-10T12:30:00' },
    { id: '2', title: 'Team Standup', start: '2024-10-11T09:00:00', end: '2024-10-11T10:00:00' }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const calendarRef = useRef(null);

  const openModal = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDateClick = (info) => {
    alert(`Clicked on date: ${info.dateStr}`);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = events.map(event => {
      if (event.id === info.event.id) {
        return { ...event, start: info.event.start, end: info.event.end };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleEventClick = (info) => {
    openModal(info);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Calendar Content */}
        <div className="flex-1 p-5 relative overflow-hidden">
          <h2 className="font-semibold text-2xl mb-4">Workshop Calendar</h2>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, momentPlugin]}
            initialView="timeGridWeek" // Set the initial view to week
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay,listWeek' // Adjust toolbar buttons to remove month view
            }}
            editable={true} // allows drag-and-drop
            droppable={true} // allows external drag sources
            selectable={true}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop} // handle drag and drop
            slotMinTime="07:00:00" // Start time for the time grid
            slotMaxTime="18:00:00" // End time for the time grid
            scrollTime="07:00:00" // Set scroll time to prevent middle hour line
            height="100vh" // Full height of the viewport
            eventDidMount={(info) => {
              // Hide the middle hour line (12 PM)
              const hourLines = info.el.querySelectorAll('.fc-time-grid .fc-hour');
              hourLines.forEach(line => {
                if (line.getAttribute('data-date') === '12') {
                  line.style.display = 'none';
                }
              });
            }}
            dayMaxEvents={true} // Allow "more" link when too many events
          />
          <div
            className="current-time-line"
            style={{
              position: 'absolute',
              top: `${((currentTime.getHours() * 60) + currentTime.getMinutes()) * 2}px`, // Adjust the factor for correct positioning
              left: 0,
              right: 0,
              height: '2px', // Adjust thickness
              backgroundColor: 'red', // Color of the line
              zIndex: 10 // Make sure the line is on top of other elements
            }}
          ></div>
        </div>
      </div>

      {/* Modal for Event Details */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Event Details">
        {selectedEvent && (
          <div>
            <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
            <p>
              <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {selectedEvent.end ? selectedEvent.end.toLocaleString() : 'N/A'}
            </p>
            <button onClick={closeModal} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
