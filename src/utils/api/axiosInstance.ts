import axios from 'axios';
import {signOut} from 'next-auth/react';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// When an authenticated request is rejected, the session has expired or been
// revoked: sign out so the user is sent back to the login page.
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const hadToken = Boolean(error?.config?.headers?.Authorization);
        if (typeof window !== "undefined" && hadToken && error?.response?.status === 401) {
            await signOut({callbackUrl: "/login"}).catch(() => undefined);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
