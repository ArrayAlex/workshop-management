// src/pages/SetupPage/SetupPage.js
import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import GeneralSettings from './GeneralSettings/GeneralSettings';
import InvoicingSettings from './InvoicingSettings/InvoicingSettings';
import AccountsSettings from './AccountsSettings/AccountsSettings';
import IntegrationsSettings from './IntegrationsSettings/IntegrationsSettings';
import MiscSettings from './MiscSettings/MiscSettings';
import JobTypesSettings from './JobTypesSettings/JobTypesSettings'; // Import JobTypesSettings
import WorkshopSetup from './JobStatusesSettings/JobStatusesSettings';

import { Helmet } from 'react-helmet';

const CustomAlert = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
    <span className="block sm:inline">{message}</span>
  </div>
);

const SetupPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'invoicing':
        return <InvoicingSettings />;
      case 'accounts':
        return <AccountsSettings />;
      case 'integrations':
        return <IntegrationsSettings />;
      case 'misc':
        return <MiscSettings />;
      case 'job-types': // New case for Job Types
        return <JobTypesSettings />;
      case 'job-statuses': // New case for Job Statuses
        return <WorkshopSetup />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Helmet>
        <title>Setup | Hoist</title>
        <link rel="icon" href="https://img.icons8.com/emoji/48/sport-utility-vehicle.png" type="image/png" />
      </Helmet>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Workshop Setup</h1>

          {message && <CustomAlert message={message} />}

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {['general', 'invoicing', 'accounts', 'integrations', 'misc', 'job-types', 'job-statuses'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab.replace('-', ' ')} {/* Display as "Job Types" instead of "job-types" */}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            {renderTabContent()}
          </div>

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SetupPage;
