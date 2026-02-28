interface HandleFormDataFetchOptions extends RequestInit {
    data?: FormData;
}

/**
 * Wrapper for fetch requests
 *
 * @param {} endpoint API URL's endpoint
 * @param {} options request's custom options (optional)
 */
export const handleFormDataFetch = async (endpoint: string, { data, ...customOptions }: HandleFormDataFetchOptions | Record<string, never> = {}) => {
    const token = localStorage.getItem('token');
    const headers: RequestInit['headers'] = {};
    if (token && endpoint !== 'api/auth/jwt/refresh/') {
        headers.Authorization = `Bearer ${token}`;
    }
    const options: RequestInit = {
        method: customOptions.method || 'POST',
        headers: {
            ...headers,
            ...customOptions.headers,
        },
        credentials: 'include',
        ...customOptions,
    };
    if (data) {
        options.body = data;
    }
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, options);
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
