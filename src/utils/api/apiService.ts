import axiosInstance from './axiosInstance';
import {getSession} from "next-auth/react";
import {AxiosRequestConfig} from "axios";

const getAuthToken = async () => {
    const session = await getSession();
    console.log(session);
    if (session?.accessToken) {
        return `Bearer ${session.accessToken}`;
    } else {
        throw new Error('Session not found or token missing.');
    }
};

export const fetchData = async (url: string, useToken?: boolean, axiosConf?: AxiosRequestConfig) => {
    try {
        if (useToken) {
            const token = await getAuthToken();
            axiosConf = axiosConf || {};
            axiosConf.headers = axiosConf.headers || {};
            axiosConf.headers.Authorization = token;
        }
        const response = await axiosInstance.get(url, axiosConf);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};

export const postData = async (url: string, data: any, useToken?: boolean, axiosConf?: AxiosRequestConfig) => {
    try {
        if (useToken) {
            const token = await getAuthToken();
            axiosConf = axiosConf || {};
            axiosConf.headers = axiosConf.headers || {};
            axiosConf.headers.Authorization = token;
        }
        const response = await axiosInstance.post(url, data, axiosConf);
        return response.data;
    } catch (error) {
        console.error('Failed to post data:', error);
        throw error;
    }
};
