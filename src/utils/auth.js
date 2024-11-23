import axiosInstance from '../api/axiosInstance';

export const checkAuth = async () => {
    try {
        const response = await axiosInstance.get('/auth/verify');
        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};