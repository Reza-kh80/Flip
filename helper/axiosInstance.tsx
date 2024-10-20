import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { setCookie, getCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

const isServer = typeof window === 'undefined';

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

interface QueueItem {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    timeout: 25000,
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
    async (config: InternalAxiosRequestConfig) => {
        const accessToken = isServer
            ? getCookie('accessToken', { req: config.req as any, res: config.res as any })
            : Cookies.get('accessToken');

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
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

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

            const refreshToken = isServer
                ? getCookie('refreshToken', { req: originalRequest.req as any, res: originalRequest.res as any })
                : Cookies.get('refreshToken');

            try {
                const { data } = await axios.post<RefreshTokenResponse>(
                    `${axiosInstance.defaults.baseURL}/users/refresh-token`,
                    { refreshToken }
                );
                const { accessToken, refreshToken: newRefreshToken } = data;

                if (isServer) {
                    setCookie('accessToken', accessToken, { req: originalRequest.req as any, res: originalRequest.res as any, maxAge: 30 });
                    setCookie('refreshToken', newRefreshToken, { req: originalRequest.req as any, res: originalRequest.res as any, maxAge: 7 * 24 * 60 * 60 });
                } else {
                    Cookies.set('accessToken', accessToken, { expires: 30 / 86400 });
                    Cookies.set('refreshToken', newRefreshToken, { expires: 7 });
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                if (isServer) {
                    setCookie('accessToken', '', { req: originalRequest.req as any, res: originalRequest.res as any, maxAge: 0 });
                    setCookie('refreshToken', '', { req: originalRequest.req as any, res: originalRequest.res as any, maxAge: 0 });
                } else {
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');
                }
                // Redirect to login or handle authentication failure
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
        const accessToken = isServer
            ? getCookie('accessToken', context)
            : Cookies.get('accessToken');
        if (accessToken) {
            try {
                const { data } = await axiosInstance.post<RefreshTokenResponse>(`${axiosInstance.defaults.baseURL}/users/refresh-token`, {
                    refreshToken: isServer
                        ? getCookie('refreshToken', context)
                        : Cookies.get('refreshToken'),
                });
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

                if (isServer) {
                    setCookie('accessToken', newAccessToken, { ...context, maxAge: 30 });
                    setCookie('refreshToken', newRefreshToken, { ...context, maxAge: 7 * 24 * 60 * 60 });
                } else {
                    Cookies.set('accessToken', newAccessToken, { expires: 30 / 86400 });
                    Cookies.set('refreshToken', newRefreshToken, { expires: 7 });
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        }
    }, 20000); // 20 seconds interval (10 seconds before expiry)
};

// Call this function when your app initializes
if (!isServer) {
    setupRefreshTimer();
}

export default axiosInstance;