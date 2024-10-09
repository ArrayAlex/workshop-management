import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md p-2"> {/* Reduced padding */}
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle Button */}
        <button className="mr-4">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => console.log("Toggle Sidebar")}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Logo and Search Field */}
        <div className="flex items-center flex-grow">
          <span className="text-xl font-bold mr-4">Hoist</span>
          <input
            type="text"
            placeholder="Search..."
            className="p-1 rounded bg-gray-200 text-black w-48" // Reduced padding
          />
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <button
            className="focus:outline-none"
            onClick={toggleDropdown}
          >
            {/* Profile Photo Style Icon */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c3.866 0 7 1.343 7 3v1H5v-1c0-1.657 3.134-3 7-3zM12 12c-2.485 0-4.5-2.015-4.5-4.5S9.515 3 12 3s4.5 2.015 4.5 4.5S14.485 12 12 12z" />
              </svg>
            </div>
          </button>
          {/* Dropdown Menu for Profile Info */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
              <div className="p-2 border-b">
                <strong>John Doe</strong><br />
                <span>Position: Technician</span>
              </div>
              <ul>
                <li className="hover:bg-gray-200 p-2"><Link to="/settings">Settings</Link></li>
                <li className="hover:bg-gray-200 p-2"><Link to="/account">Account Info</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
