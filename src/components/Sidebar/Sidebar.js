// src/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboardList, faUsers, faCalendarAlt, faChartBar, faCog, faSackDollar, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation(); // Get the current location

  // Function to determine if the link is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-200' : '';
  };

  return (
    <aside className="bg-white-10 text-gray-800 w-64 p-4 shadow-lg rounded-lg">
      <h2 className="font-semibold text-lg mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className={`flex items-center block p-2 rounded ${isActive('/dashboard')}`}>
            <FontAwesomeIcon icon={faTachometerAlt} className="h-5 w-5 mr-2 text-gray-700" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/jobs" className={`flex items-center block p-2 rounded ${isActive('/jobs')}`}>
            <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 mr-2 text-gray-700" />
            Job Board
          </Link>
        </li>
        <li>
          <Link to="/invoice" className={`flex items-center block p-2 rounded ${isActive('/invoice')}`}>
            <FontAwesomeIcon icon={faSackDollar} className="h-5 w-5 mr-2 text-gray-700" />
            Invoices
          </Link>
        </li>
        <li>
          <Link to="/cal" className={`flex items-center block p-2 rounded ${isActive('/cal')}`}>
            <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 mr-2 text-gray-700" />
            Diary
          </Link>
        </li>
        <li>
          <Link to="/customers" className={`flex items-center block p-2 rounded ${isActive('/customers')}`}>
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 mr-2 text-gray-700" />
            Customers
          </Link>
        </li>
        <li>
          <Link to="/reports" className={`flex items-center block p-2 rounded ${isActive('/reports')}`}>
            <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-2 text-gray-700" />
            Reports
          </Link>
        </li>
        {/* <li>
          <Link to="/settings" className={`flex items-center block p-2 rounded ${isActive('/settings')}`}>
            <FontAwesomeIcon icon={faCog} className="h-5 w-5 mr-2 text-gray-700" />
            Settings
          </Link>
        </li> */}
        <li>
          <Link to="/setup" className={`flex items-center block p-2 rounded ${isActive('/setup')}`}>
            <FontAwesomeIcon icon={faScrewdriverWrench} className="h-5 w-5 mr-2 text-gray-700" />
            Setup
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
