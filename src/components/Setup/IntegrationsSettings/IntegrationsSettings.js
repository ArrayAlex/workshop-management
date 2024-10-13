import React, { useState } from 'react';

const IntegrationsSettings = () => {
  const [integrations, setIntegrations] = useState({
    afterpay: false,
    stripe: false,
    quickbooks: false,
    shopify: false,
  });

  const handleIntegrationToggle = (key) => {
    setIntegrations({ ...integrations, [key]: !integrations[key] });
  };

  return (
    <div className="space-y-4">
      {Object.entries(integrations).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="capitalize">{key}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={value}
              onChange={() => handleIntegrationToggle(key)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default IntegrationsSettings;