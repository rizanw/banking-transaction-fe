import axiosInstance from './axiosInstance';
import {getSession} from "next-auth/react";
import {AxiosRequestConfig} from "axios";

const withAuth = async (axiosConf: AxiosRequestConfig = {}): Promise<AxiosRequestConfig> => {
    const session = await getSession();
    if (!session?.accessToken) {
        throw new Error('Session not found or token missing.');
    }
    return {
        ...axiosConf,
        headers: {...axiosConf.headers, Authorization: `Bearer ${session.accessToken}`},
    };
};

export const fetchData = async (url: string, useToken?: boolean, axiosConf?: AxiosRequestConfig) => {
    const conf = useToken ? await withAuth(axiosConf) : axiosConf;
    const response = await axiosInstance.get(url, conf);
    return response.data;
};

export const postData = async (url: string, data: unknown, useToken?: boolean, axiosConf?: AxiosRequestConfig) => {
    const conf = useToken ? await withAuth(axiosConf) : axiosConf;
    const response = await axiosInstance.post(url, data, conf);
    return response.data;
};
