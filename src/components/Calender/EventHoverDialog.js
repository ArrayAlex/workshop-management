import React, { useState, useEffect, useRef} from 'react';

import './Calendar.css';



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
          minWidth: '200px',
          maxWidth: '300px',
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <h3>{event.title}</h3>
        <p>Job ID: {event.extendedProps.jobId}</p>
        <p>Status: {event.extendedProps.jobStatus}</p>
        <p>Description: {event.extendedProps.description}</p>
        <p>Customer ID: {event.extendedProps.customerId}</p>
        <p>Vehicle ID: {event.extendedProps.vehicleId}</p>
        <p>Pickup Date: {event.extendedProps.pickup ? new Date(event.extendedProps.pickup).toLocaleString() : 'N/A'}</p>
        {event.extendedProps.technicians && event.extendedProps.technicians.length > 0 && (
          <p>Technicians: {event.extendedProps.technicians.join(', ')}</p>
        )}
      </div>
    );
  };

  export default EventHoverDialog;


  //  <p>Technicians: {event.extendedProps.technicians.join(', ')}</p>