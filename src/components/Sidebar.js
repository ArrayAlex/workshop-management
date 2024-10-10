// src/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboardList, faCar, faUsers, faCalendarAlt, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <aside className="bg-white-10 text-gray-800 w-64 p-4 shadow-lg rounded-lg">
      <h2 className="font-semibold text-lg mb-4">Dashboard Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faTachometerAlt} className="h-5 w-5 mr-2 text-gray-700" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 mr-2 text-gray-700" />
            Job Board
          </Link>
        </li>
        {/* <li>
          <Link to="/vehicles" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faCar} className="h-5 w-5 mr-2 text-gray-700" />
            Vehicles
          </Link>
        </li> */}
        <li>
          <Link to="/cal" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 mr-2 text-gray-700" />
            Calender
          </Link>
        </li>
        <li>
          <Link to="/customers" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 mr-2 text-gray-700" />
            Customers
          </Link>
        </li>
        <li>
          <Link to="/appointments" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 mr-2 text-gray-700" />
            Appointments
          </Link>
        </li>
        <li>
          <Link to="/reports" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faChartBar} className="h-5 w-5 mr-2 text-gray-700" />
            Reports
          </Link>
        </li>
        <li>
          <Link to="/settings" className="flex items-center block hover:bg-gray-200 p-2 rounded">
            <FontAwesomeIcon icon={faCog} className="h-5 w-5 mr-2 text-gray-700" />
            Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
