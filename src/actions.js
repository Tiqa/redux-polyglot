import { SET_LOCALE } from './constants';

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    payload: locale,
});
