import { SET_LANGUAGE } from './constants';

export const setLanguage = (locale, phrases) => ({
    type: SET_LANGUAGE,
    payload: {
        locale,
        phrases,
    },
});
