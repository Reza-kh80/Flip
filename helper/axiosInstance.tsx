import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    AxiosRequestHeaders
} from 'axios';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { IncomingHttpHeaders } from 'http';

const isServer = typeof window === 'undefined';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface ServerSessionRequest {
    headers: IncomingHttpHeaders;
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config: CustomInternalAxiosRequestConfig): Promise<CustomInternalAxiosRequestConfig> => {
        let session: Session | null = null;

        if (isServer) {
            const { headers } = config;
            if (headers?.cookie) {
                session = await getSession({
                    req: { headers: { cookie: headers.cookie } } as ServerSessionRequest,
                });
            }
        } else {
            session = await getSession();
        }

        if (session?.accessToken) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const session = await getSession();

                if (!session) {
                    if (!isServer) {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }

                if (!originalRequest.headers) {
                    originalRequest.headers = {} as AxiosRequestHeaders;
                }
                originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (!isServer) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;