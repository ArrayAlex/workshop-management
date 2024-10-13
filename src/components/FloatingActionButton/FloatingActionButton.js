// FloatingActionButton.js
import React, { useState } from 'react';
import './FloatingActionButton.css';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fab-container">
            <button className={`fab-button ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span className="plus-icon">+</span>
            </button>
            <div className={`fab-menu ${isOpen ? 'show' : ''}`}>
                <button className="fab-menu-item">Create Job</button>
                <button className="fab-menu-item">Create Booking</button>
                <button className="fab-menu-item">Add Customer</button>
                <button className="fab-menu-item">Create Invoice</button>
            </div>
        </div>
    );
};

export default FloatingActionButton;