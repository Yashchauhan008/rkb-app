import { serverDetails } from '@/src/config';
import { clearAuthData, getAuthToken } from '@/src/context/storage';
import axios from 'axios';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const axiosInstance = axios.create({
    baseURL: serverDetails.serverProxyURL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401 && error.response?.data?.code === 'unauthorized') {
            Toast.show({
                type: 'error',
                text1: error.response?.data?.message || 'Unauthorized',
            });
            clearAuthData();
            router.replace('/login');
        }
        return Promise.reject(error.response?.data || error);
    },
);

export default axiosInstance;
