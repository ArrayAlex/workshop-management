import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { debounce } from 'lodash';
import axiosInstance from '../../api/axiosInstance';
import JobModal from '../JobModal/JobsModal'; // Make sure the path is correct
import CustomerModal from '../CustomerModal/CustomerModal'; // Make sure the path is correct
import VehicleModal from '../VehicleModal/VehicleModal'; // Make sure the path is correct

const searchApis = {
  customers: (query) =>
    axiosInstance.get(`customer/search?searchTerm=${encodeURIComponent(query)}`)
      .then(res => {
        console.log('Customer search results:', res.data);
        return res.data;
      })
      .catch(error => {
        console.error('Error searching customers:', error);
        throw error;
      }),
  vehicles: (query) =>
    axiosInstance.get(`vehicle/search?searchTerm=${encodeURIComponent(query)}`)
      .then(res => {
        console.log('Vehicle search results:', res.data);
        return res.data;
      })
      .catch(error => {
        console.error('Error searching vehicles:', error);
        throw error;
      }),
  jobs: (query) =>
    axiosInstance.get(`job/search?searchTerm=${encodeURIComponent(query)}`)
      .then(res => {
        console.log('Job search results:', res.data);
        return res.data;
      })
      .catch(error => {
        console.error('Error searching jobs:', error);
        throw error;
      }),
};

const SearchComponent = ({ onResultSelect, technicians, customers, vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // eslint-disable-next-line
  const debouncedSearch = useCallback(
    debounce((term) => setSearchTerm(term), 300),
    []
  );

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery(
    ['customers', searchTerm],
    () => searchApis.customers(searchTerm),
    {
      enabled: !!searchTerm,
      onSuccess: (data) => console.log('Customers data:', data),
    }
  );

  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery(
    ['vehicles', searchTerm],
    () => searchApis.vehicles(searchTerm),
    {
      enabled: !!searchTerm,
      onSuccess: (data) => console.log('Vehicles data:', data),
    }
  );

  const { data: jobsData, isLoading: isLoadingJobs } = useQuery(
    ['jobs', searchTerm],
    () => searchApis.jobs(searchTerm),
    {
      enabled: !!searchTerm,
      onSuccess: (data) => console.log('Jobs data:', data),
    }
  );

  const handleInputChange = (e) => {
    debouncedSearch(e.target.value);
    setIsDropdownVisible(true);
  };

  const handleResultClick = (item, type) => {
    console.log('Clicked item:', item);
    if (type === 'jobs') {
      setSelectedJob(item);
      setIsJobModalOpen(true);
    } else if (type === 'customers') {
      setSelectedCustomer(item);
      setIsCustomerModalOpen(true);
    } else if (type === 'vehicles') {
      setSelectedVehicle(item);
      setIsVehicleModalOpen(true);
    } else {
      onResultSelect(item, type);
    }
    setIsDropdownVisible(false);
  };

  const handleJobSave = (updatedJob) => {
    console.log('Saving job:', updatedJob);
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleCustomerSave = (updatedCustomer) => {
    console.log('Saving customer:', updatedCustomer);
    setIsCustomerModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleVehicleSave = (updatedVehicle) => {
    console.log('Saving vehicle:', updatedVehicle);
    setIsVehicleModalOpen(false);
    setSelectedVehicle(null);
  };

  const renderResults = (data, title, type) => {
    if (data && data.length > 0) {
      return (
        <div className="p-2 border-b" key={type}>
          <h3 className="font-bold text-black">{title}</h3>
          {data.slice(0, 4).map(item => (
            <div
              key={item.id || item.jobId}
              className="text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded"
              onClick={() => handleResultClick(item, type)}
            >
              {type === 'customers' && `${item.firstName} ${item.lastName}`}
              {type === 'vehicles' && (
                <div>
                  <span>{item.make} {item.model}</span>
                  <span className="ml-2 text-sm text-gray-500">({item.rego})</span>
                </div>
              )}
              {type === 'jobs' && (
                <div>
                  <span>Job #{item.jobId}</span>
                  <span className="ml-2 text-sm text-gray-500">{item.status}</span>
                </div>
              )}
            </div>
          ))}
          {data.length > 4 && (
            <div className="text-sm text-gray-500 mt-1">
              {data.length - 4} more results...
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">  
      <input
        type="text"
        placeholder="Search..."
        onChange={handleInputChange}
        className="p-2 rounded bg-gray-200 text-black w-48"
      />
      {isDropdownVisible && searchTerm && (
        <div className="absolute mt-1 w-64 bg-white rounded shadow-lg z-10 text-gray-800">
          {(isLoadingCustomers || isLoadingVehicles || isLoadingJobs) && <div className="p-2">Loading...</div>}
          {renderResults(customersData, "Customers", 'customers')}
          {renderResults(vehiclesData, "Vehicles", 'vehicles')}
          {renderResults(jobsData, "Jobs", 'jobs')}
          {(!customersData || customersData.length === 0) && 
           (!vehiclesData || vehiclesData.length === 0) && 
           (!jobsData || jobsData.length === 0) && (
            <div className="p-2 text-gray-700">No results found</div>
          )}
        </div>
      )}
      {selectedJob && (
        <JobModal
          isOpen={isJobModalOpen}
          onClose={() => setIsJobModalOpen(false)}
          job={selectedJob}
          onSave={handleJobSave}
          technicians={technicians}
          customers={customers}
          vehicles={vehicles}
        />
      )}
      {selectedCustomer && (
        <CustomerModal
          isOpen={isCustomerModalOpen}
          onRequestClose={() => setIsCustomerModalOpen(false)}
          customerData={selectedCustomer}
          onSave={handleCustomerSave}
        />
      )}
      {selectedVehicle && (
        <VehicleModal
          isOpen={isVehicleModalOpen}
          onRequestClose={() => setIsVehicleModalOpen(false)}
          vehicleData={selectedVehicle}
          onSave={handleVehicleSave}
        />
      )}
    </div>
  );
};

export default SearchComponent;