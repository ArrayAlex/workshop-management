import React, { useState } from 'react';
import { Building, MapPin, Phone, Mail, Globe, DollarSign, Image } from 'lucide-react';

const GeneralSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    tradingName: 'My Workshop',
    companyDescription: '',
    displayName: '',
    address: '123 Main St, City, Country',
    phone: '+1 234 567 8900',
    fax: '',
    logo: null,
    mobile: '',
    email: 'contact@myworkshop.com',
    webPage: '',
    gstNo: '',
    country: '',
    industry: '',
    nextJobNo: '',
    nextOrderNo: '',
    defaultGstRate: '',
    termsAgreed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({ 
      ...generalSettings, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGeneralSettings({ ...generalSettings, logo: file });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trading Name</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Building className="h-5 w-5" />
            </span>
            <input
              type="text"
              name="tradingName"
              value={generalSettings.tradingName}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            name="displayName"
            value={generalSettings.displayName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Company Description</label>
          <textarea
            name="companyDescription"
            value={generalSettings.companyDescription}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <MapPin className="h-5 w-5" />
            </span>
            <input
              type="text"
              name="address"
              value={generalSettings.address}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Phone className="h-5 w-5" />
            </span>
            <input
              type="tel"
              name="phone"
              value={generalSettings.phone}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fax</label>
          <input
            type="tel"
            name="fax"
            value={generalSettings.fax}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={generalSettings.mobile}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Mail className="h-5 w-5" />
            </span>
            <input
              type="email"
              name="email"
              value={generalSettings.email}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Web Page</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Globe className="h-5 w-5" />
            </span>
            <input
              type="url"
              name="webPage"
              value={generalSettings.webPage}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GST No</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <DollarSign className="h-5 w-5" />
            </span>
            <input
              type="text"
              name="gstNo"
              value={generalSettings.gstNo}
              onChange={handleInputChange}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            name="country"
            value={generalSettings.country}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Please Select</option>
            <option value="Australia">Australia</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Samoa">Samoa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            name="industry"
            value={generalSettings.industry}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Please Select</option>
            <option value="Automotive Repairer Cars">Automotive Repairer Cars</option>
            <option value="Automotive Repairer Trucks">Automotive Repairer Trucks</option>
            <option value="Automotive Repairer Heavy Equipment">Automotive Repairer Heavy Equipment</option>
            <option value="Automotive Repairer Motorbikes">Automotive Repairer Motorbikes</option>
            <option value="Engine Reconditioner">Engine Reconditioner</option>
            <option value="Automotive -Franchise">Automotive -Franchise</option>
            <option value="Engineering & Manufacturing">Engineering & Manufacturing</option>
            <option value="Automotive - Tyre Shop">Automotive - Tyre Shop</option>
            <option value="Auto Electrician">Auto Electrician</option>
            <option value="Marine">Marine</option>
            <option value="Marine - Boats">Marine - Boats</option>
            <option value="Marine - JetSkis">Marine - JetSkis</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Maintenance - Air Conditioning">Maintenance - Air Conditioning</option>
            <option value="Maintenance - Generators">Maintenance - Generators</option>
            <option value="Aviation & Aerospace">Aviation & Aerospace</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Agriculture - LiveStock">Agriculture - LiveStock</option>
            <option value="Agriculture - Seed Merchant">Agriculture - Seed Merchant</option>
            <option value="Accounting">Accounting</option>
            <option value="Mining & Metals">Mining & Metals</option>
            <option value="Service & Repair">Service & Repair</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Next Job No</label>
          <input
            type="text"
            name="nextJobNo"
            value={generalSettings.nextJobNo}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Next Order No</label>
          <input
            type="text"
            name="nextOrderNo"
            value={generalSettings.nextOrderNo}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Default GST Rate</label>
          <select
            name="defaultGstRate"
            value={generalSettings.defaultGstRate}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Please Select</option>
            <option value="Exempt (0%)">Exempt (0%)</option>
            <option value="Standard (15%)">Standard (15%)</option>
            <option value="Zero Rated (0%)">Zero Rated (0%)</option>
          </select>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Dimensions: Corner (550wx163h) or Across top of page (923wx163h)</p>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="termsAgreed"
          type="checkbox"
          checked={generalSettings.termsAgreed}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I have read and agree to the Hoist Terms of Use
          </label>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save General Settings
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;