const API_URL = import.meta.env.VITE_API_URL || ''; // empty for production
interface FetchOptions extends RequestInit {
    data?: object;
}

/**
 * Wrapper for fetch requests
 *
 * @param {} endpoint API URL's endpoint
 * @param {} options request's custom options (optional)
 */
export const handleFetch = async (endpoint: string, { data, ...customOptions }: FetchOptions | Record<string, never> = {}) => {
    const token = localStorage.getItem('token');
    const headers: RequestInit['headers'] = {};
    if (token && endpoint !== 'api/auth/jwt/refresh/') {
        headers.Authorization = `Bearer ${token}`;
    }
    if (data) {
        headers['Content-Type'] = 'application/json;charset=utf-8';
    }
    const options: RequestInit = {
        method: customOptions.method || 'GET',
        headers: {
            ...headers,
            ...customOptions.headers,
        },
        credentials: 'include',
        ...customOptions,
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, options);
        if (res.status === 401) {
            localStorage.removeItem('token');
        }
        if (res.status === 204) {
            return res;
        }
        const result = await res.json();
        if (res.ok) {
            return result;
        } else {
            if (result.data.detail) {
                throw new Error(result.data.detail);
            } else {
                const errorCause: Record<string, string> = {};
                for (const key in result.data) {
                    errorCause[key] = result.data[key];
                }
                throw new Error('Validation Error', { cause: errorCause });
            }
        }
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('checkYourInternetConnection');
        }
        throw error;
    }
};
