export const SET_LANGUAGE = '@@polyglot/SET_LANGUAGE';
export const SET_LOCALE = '@@polyglot/SET_LOCALE';

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    payload: locale,
});
