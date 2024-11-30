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
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config: CustomInternalAxiosRequestConfig): Promise<CustomInternalAxiosRequestConfig> => {
        let session: Session | null = null;

        // Get session differently based on environment
        if (isServer) {
            // In SSR, we need to pass the request context
            const { headers } = config;
            if (headers?.cookie) {
                // If we have the session cookie, get the session
                session = await getSession({
                    req: { headers: { cookie: headers.cookie } } as ServerSessionRequest,
                });
            }
        } else {
            // In CSR, we can get the session directly
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

// Response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get a fresh session
                const session = await getSession();

                if (!session) {
                    // If no session, redirect to login
                    if (!isServer) {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }

                // Update the original request with the new token
                if (!originalRequest.headers) {
                    originalRequest.headers = {} as AxiosRequestHeaders;
                }
                originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

                // Retry the original request
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