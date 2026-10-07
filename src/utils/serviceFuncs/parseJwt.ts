interface JwtPayload {
    restaurants_manager?: { id: number }[];
}

/**
 * Decodes the payload of a JWT without verifying its signature
 *
 * @param {} token JWT string
 */
export const parseJwt = (token: string): JwtPayload | null => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};
