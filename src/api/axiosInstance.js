import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost/api/', // Replace with your backend URL
    timeout: 1000,
});

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
