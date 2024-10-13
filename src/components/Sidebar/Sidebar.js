import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboardList, faUsers, faCalendarAlt, faChartBar, faSackDollar, faScrewdriverWrench, faGear } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', icon: faTachometerAlt, label: 'Dashboard' },
    { path: '/jobs', icon: faClipboardList, label: 'Job Board' },
    { path: '/invoice', icon: faSackDollar, label: 'Invoices' },
    { path: '/cal', icon: faCalendarAlt, label: 'Diary' },
    { path: '/customers', icon: faUsers, label: 'Customers' },
    { path: '/reports', icon: faChartBar, label: 'Reports' },
    { path: '/setup', icon: faScrewdriverWrench, label: 'Setup' },
  ];

  return (
    <aside className={`bg-white h-full shadow-md flex flex-col transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-64'} overflow-x-hidden`}>
      <nav className="flex-1 overflow-y-auto overflow-hidden py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center relative py-2 px-4 text-sm font-medium transition-colors duration-150 ease-in-out
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                title={item.label}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-5 w-5 flex-shrink-0 ${isActive(item.path) ? 'text-blue-500' : 'text-gray-400'}`}
                />
                <span 
                  className={`absolute left-12 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className="flex items-center relative px-1 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
        >
          <FontAwesomeIcon icon={faGear} className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span 
            className={`absolute left-12 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
          >
            Settings
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;