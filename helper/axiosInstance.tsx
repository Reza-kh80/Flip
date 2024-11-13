import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

const isServer = typeof window === 'undefined';
const REFRESH_INTERVAL = (15 - 1) * 60 * 1000;

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    req?: NextApiRequest;
    res?: NextApiResponse;
}

interface QueueItem {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 5000,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    async (config: CustomAxiosRequestConfig) => {
        const accessToken = getCookie('accessToken', {
            req: config.req,
            res: config.res
        });

        if (accessToken) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<unknown>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (typeof token === 'string') {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        }
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getCookie('refreshToken', {
                req: originalRequest.req,
                res: originalRequest.res
            });

            try {
                const { data } = await axios.post<RefreshTokenResponse>(
                    `${axiosInstance.defaults.baseURL}/users/refresh-token`,
                    { refreshToken }
                );
                const { accessToken, refreshToken: newRefreshToken } = data;

                setCookie('accessToken', accessToken, {
                    req: originalRequest.req as any,
                    res: originalRequest.res as any,
                    maxAge: 15 * 60
                });

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                deleteCookie('accessToken', {
                    req: originalRequest.req as any,
                    res: originalRequest.res as any
                });
                deleteCookie('refreshToken', {
                    req: originalRequest.req as any,
                    res: originalRequest.res as any
                });
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

const setupRefreshTimer = (context?: GetServerSidePropsContext): void => {
    setInterval(async () => {
        const accessToken = getCookie('accessToken', context);
        if (accessToken) {
            try {
                const { data } = await axiosInstance.post<RefreshTokenResponse>(
                    `${axiosInstance.defaults.baseURL}/users/refresh-token`,
                    {
                        refreshToken: getCookie('refreshToken', context)
                    }
                );
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

                setCookie('accessToken', newAccessToken, {
                    ...context,
                    maxAge: 15 * 60
                });

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        deleteCookie('accessToken', context);
                        deleteCookie('refreshToken', context);
                        if (!isServer) {
                            window.location.href = '/';
                        }
                    }
                    console.error('Failed to refresh token:', error);
                }
            }
        }
    }, REFRESH_INTERVAL);
};

if (!isServer) {
    setupRefreshTimer();
}

export default axiosInstance;