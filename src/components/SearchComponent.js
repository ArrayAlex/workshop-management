import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { debounce } from 'lodash';
import axiosInstance from '../api/axiosInstance';

const searchApis = {
  customers: (query) => axiosInstance.get(`customer/search?searchTerm=${encodeURIComponent(query)}`)
    .then(res => res.data)
    .catch(error => {
      console.error('Error searching customers:', error);
      throw error;
    }),
  vehicles: (query) => axiosInstance.get(`vehicle/search?searchTerm=${encodeURIComponent(query)}`)
    .then(res => res.data)
    .catch(error => {
      console.error('Error searching vehicles:', error);
      throw error;
    }),
  jobs: (query) => axiosInstance.get(`jobs?search=${query}`).then(res => res.data),
};

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((term) => setSearchTerm(term), 300),
    []
  );

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery(
    ['customers', searchTerm],
    () => searchApis.customers(searchTerm),
    { enabled: !!searchTerm }
  );

  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery(
    ['vehicles', searchTerm],
    () => searchApis.vehicles(searchTerm),
    { enabled: !!searchTerm }
  );

  const { data: jobsData, isLoading: isLoadingJobs } = useQuery(
    ['jobs', searchTerm],
    () => searchApis.jobs(searchTerm),
    { enabled: !!searchTerm }
  );

  const handleInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const renderResults = (data, title, renderItem) => {
    if (data && data.length > 0) {
      return (
        <div className="p-2 border-b">
          <h3 className="font-bold text-black">{title}</h3>
          {data.slice(0, 4).map(renderItem)}
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
        className="p-1 rounded bg-gray-200 text-black w-48"
      />
      {searchTerm && (
        <div className="absolute mt-1 w-64 bg-white rounded shadow-lg z-10 text-gray-800">
          {(isLoadingCustomers || isLoadingVehicles || isLoadingJobs) && <div className="p-2">Loading...</div>}
          {renderResults(customersData, "Customers", customer => (
            <div key={customer.id} className="text-gray-700">{customer.firstName} {customer.lastName}</div>
          ))}
          {renderResults(vehiclesData, "Vehicles", vehicle => (
            <div key={vehicle.id} className="text-gray-700">{vehicle.make} {vehicle.model}</div>
          ))}
          {renderResults(jobsData, "Jobs", job => (
            <div key={job.id} className="text-gray-700">{job.title}</div>
          ))}
          {(!customersData || customersData.length === 0) && 
           (!vehiclesData || vehiclesData.length === 0) && 
           (!jobsData || jobsData.length === 0) && (
            <div className="p-2 text-gray-700">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;