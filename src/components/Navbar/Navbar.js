import React, { useState, useEffect, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import SearchComponent from '../SearchComponent/SearchComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // For profile icon
import './Navbar.css';
import axiosInstance from "../../api/axiosInstance";

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = async () => {
    const response = await axiosInstance.post('/auth/logout/');
    if (response.status == 200){
      localStorage.removeItem('userPlan');
      navigate('/login');
    }
  }

  return (
    <nav id="navbar" className="text-white shadow-md p-2">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle Button */}
        <button className="mr-4" onClick={toggleSidebar}>
          <svg
            className="w-6 h-6 text-white hover:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Logo and Search Field */}
        <div className="flex items-center flex-grow">
          <span className="text-xl font-bold mr-4">Hoist</span>
          <SearchComponent />
        </div>

        {/* Profile Icon */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="focus:outline-none"
            onClick={toggleDropdown}  
          >
            {/* Profile Photo Style Icon */}
            <div className="w-8 h-8 overflow-hidden border-gray-200 pt-2">
              <FontAwesomeIcon icon={faUser} size="lg" className="text-white pr-10 hover:text-gray-400" />
            </div>
          </button>
          {/* Dropdown Menu for Profile Info */}
          {dropdownOpen && (
            <div id="profile-dropdown" className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
              <div className="p-2 border-b">
                <strong>John Doe</strong><br />
                <span>Position: Technician</span>
              </div>
              <ul>
                <li className="hover:bg-gray-200 p-2">
                  <Link to="" onClick={logout} className="flex items-center block">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;