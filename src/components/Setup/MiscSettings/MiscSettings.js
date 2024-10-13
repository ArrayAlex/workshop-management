import React, { useState } from 'react';

const MiscSettings = () => {
  const [miscSettings, setMiscSettings] = useState({
    language: 'English',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    autoBackup: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMiscSettings({ ...miscSettings, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name="language"
          value={miscSettings.language}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Language"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name="timezone"
          value={miscSettings.timezone}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Timezone"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          name="dateFormat"
          value={miscSettings.dateFormat}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded"
          placeholder="Date Format"
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Auto Backup</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={miscSettings.autoBackup}
            onChange={() => setMiscSettings({...miscSettings, autoBackup: !miscSettings.autoBackup})}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default MiscSettings;