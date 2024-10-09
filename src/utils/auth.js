import axiosInstance from '../api/axiosInstance';

export const checkAuth = async () => {
    try {
        const response = await axiosInstance.get('/auth/verify');
        console.log("Auth Check Response:", response.data); // Add this line
        // Check if the API response indicates authenticated status
        return response.data.isAuthenticated; // Ensure this is set correctly in your backend
    } catch (error) {
        console.error("Auth Check Error:", error); // Add error logging
        return false; 
    }
};