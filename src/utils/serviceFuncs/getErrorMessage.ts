import { camelCase } from 'lodash';
import i18next from 'i18next';

export const getErrorMessage = (error: Error, path: string) => {
    if (error.message !== 'Validation Error') {
        return i18next.t(`${path}${camelCase(error.message)}`);
    } else {
        const cause = error.cause as Record<string, string[]>;
        let errorMessage: string = '';
        for (const key in cause) {
            cause[key].forEach((cause) => {
                cause = cause.replace("'", '');
                errorMessage = errorMessage.concat(i18next.t(`${path}${camelCase(key + ' ' + cause)}`), '\n');
            });
        }
        return errorMessage;
    }
};
