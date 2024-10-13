import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faClipboardList, faUsers, faCalendarAlt, faChartBar, faSackDollar, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

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
    <aside className={`bg-white h-full shadow-md flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
                title={isCollapsed ? item.label : ''}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} ${isActive(item.path) ? 'text-blue-500' : 'text-gray-400'}`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-150 ease-in-out"
          >
            <FontAwesomeIcon icon={faScrewdriverWrench} className="h-5 w-5 mr-3 text-gray-400" />
            Settings
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;