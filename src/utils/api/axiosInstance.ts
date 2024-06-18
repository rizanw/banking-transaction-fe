import axios from 'axios';
import {signOut} from 'next-auth/react';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const {response} = error;

        if (response && response.status === 401) {
            try {
                await signOut();
            } catch (error) {
                console.error('Failed to sign out:', error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
