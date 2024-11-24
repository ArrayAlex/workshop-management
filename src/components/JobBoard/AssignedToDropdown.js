import React, {useState, useEffect, useCallback} from 'react';
import axiosInstance from '../../api/axiosInstance';
import {Star, UserCheck2, UserCircle2, Users} from 'lucide-react';
import Select from 'react-select';
import {MagnifyingGlassCircleIcon} from "@heroicons/react/24/outline";
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";

const AssignedToDropdown = ({onTechnicianChange}) => {
    const [technicians, setTechnicians] = useState([]);
    const [selectedTech, setSelectedTech] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('userid'));
        if (user) {
            try {
                const userData = JSON.parse(user);
                setCurrentUserId(userData.id);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const fetchTechnicians = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/technician/technicians');
            setTechnicians(response.data);

            // Check if there's a locked selection
            const savedTechId = localStorage.getItem('jobboardassignedto');
            const isLocked = localStorage.getItem('jobboardassignedtoLocked') === 'true';
            setIsLocked(isLocked);

            if (savedTechId && isLocked) {
                const techId = parseInt(savedTechId, 10);
                setSelectedTech(techId);
                onTechnicianChange(techId);
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
        } finally {
            setIsLoading(false);
        }
    }, [onTechnicianChange]);

    useEffect(() => {
        fetchTechnicians();
    }, [fetchTechnicians]);

    const handleChange = (selectedOption) => {
        const techId = selectedOption.value;
        setSelectedTech(techId);
        onTechnicianChange(techId);

        // Only save to localStorage if locked
        if (isLocked) {
            if (techId !== 0) {
                localStorage.setItem('jobboardassignedto', techId);
            } else {
                localStorage.removeItem('jobboardassignedto');
            }
        }
    };

    const toggleLock = () => {
        const newLockState = !isLocked;
        setIsLocked(newLockState);

        if (newLockState) {
            localStorage.setItem('jobboardassignedtoLocked', 'true');
            if (selectedTech !== 0) {
                localStorage.setItem('jobboardassignedto', selectedTech);
            }
        } else {
            localStorage.removeItem('jobboardassignedtoLocked');
            localStorage.removeItem('jobboardassignedto');
        }
    };

    const getOptionIcon = (tech) => {

        if (tech.value === 0) return <UserCircle2 className="w-4 h-4"/>;
        if (tech.value === -1) return <UserCircle2 className="w-4 h-4"/>;
        if (tech.value === -2) return <Users className="w-4 h-4"/>;

        const initials = tech.label.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        return (
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">{initials}</span>
            </div>
        );
    };

    const options = [
        {value: 0, label: 'Assigned to'},
        ...(currentUserId ? [{value: currentUserId, label: '@me'}] : []),
        {value: -2, label: 'All Technicians'},
        ...technicians.map(tech => ({
            value: tech.id,
            label: tech.name,
        }))
    ];

    const customFilterOption = (candidate, input) => {
        const label = candidate.data.label || '';
        return label.toLowerCase().includes(input.toLowerCase());
    };

    return (
        <div className="relative flex items-center space-x-2">
            <div className="relative w-56">
                <Select
                    value={options.find(option => option.value === selectedTech)}
                    onChange={handleChange}
                    options={options}
                    isSearchable={true}
                    getOptionLabel={(tech) => (
                        <div className="flex items-center space-x-2">
                            {getOptionIcon(tech)}
                            <span>{tech.label}</span>
                        </div>
                    )}
                    filterOption={customFilterOption}
                    classNamePrefix="custom-select"
                    className="bg-white text-gray-700 border border-gray-200 rounded-md shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none text-sm font-medium cursor-pointer h-10" // Ensure height is defined here
                />
            </div>

            <button
                onClick={toggleLock}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 
                          ${isLocked ? 'bg-blue-50 text-blue-500 hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-100'}`}
                title={isLocked ? "Unlock selection" : "Lock selection"}
            >
                <Star
                    className={`w-4 h-4 transition-all duration-200 ${isLocked ? 'fill-current' : 'fill-none'}`}
                />
            </button>

            {/*{isLoading && (*/}
            {/*    <div className="absolute left-0 right-0 -bottom-6">*/}
            {/*        <div className="text-sm text-gray-500 animate-pulse">*/}
            {/*            Loading...*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default AssignedToDropdown;
