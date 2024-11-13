import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { NextPageContext } from 'next';
import nextCookies from 'next-cookies';

// Helper function to set cookies on both client and server
const setCookie = (ctx: NextPageContext | null, name: string, value: string, options = {}) => {
    if (ctx && ctx.res) {
        ctx.res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly`);
    } else if (typeof document !== 'undefined') {
        document.cookie = `${name}=${value}; Path=/`;
    }
};

// Helper function to create an axios instance with SSR support
const createAxiosInstance = (ctx: NextPageContext | null): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const cookies = nextCookies(ctx || {});
            const accessToken = cookies.accessToken;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const cookies = nextCookies(ctx || {});
                    const refreshToken = cookies.refreshToken;

                    const response = await axios.post(`${instance.defaults.baseURL}/users/refresh-token`, {
                        refreshToken
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    setCookie(ctx, 'accessToken', accessToken);
                    setCookie(ctx, 'refreshToken', newRefreshToken);

                    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return instance(originalRequest);
                } catch (refreshError) {
                    setCookie(ctx, 'accessToken', '');
                    setCookie(ctx, 'refreshToken', '');

                    if (typeof window !== 'undefined') {
                        window.location.href = '/';
                    } else if (ctx && ctx.res) {
                        ctx.res.writeHead(302, { Location: '/' });
                        ctx.res.end();
                    }

                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// Export a function that creates the axios instance
export const axiosInstanceSSR = (ctx: NextPageContext | null = null) => createAxiosInstance(ctx);
