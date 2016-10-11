import { SET_LANGUAGE, SET_LOCALE } from './actions';
import { isString, isFunction, isObject, isArray } from './private/utils';

/* --- Error preventing ----------------------------------------------------- */
const checkParams = (catchedAction, getLocale, getPhrases) => {
    if (!catchedAction || !getLocale || !getPhrases)
        throw (new Error('polyglotMiddleware : missing parameters.'));
    if (!isString(catchedAction) && !isArray(catchedAction)) {
        throw (new Error(
            'polyglotMiddleware : first parameter must be a string or an array of string.'
        ));
    }
    if (!isFunction(getLocale)) {
        throw (new Error(
            'polyglotMiddleware : second parameter must be a function.'
        ));
    }
    if (!isFunction(getPhrases)) {
        throw (new Error(
            'polyglotMiddleware : third parameter must be a function.'
        ));
    }
};

const getIsValidPolyglotReducer = state => !!(state && isObject(state.polyglot));
const checkState = state => {
    if (!getIsValidPolyglotReducer(state))
        throw (new Error('polyglotReducer : need to be store in "state.polyglot"'));
};
/* -------------------------------------------------------------------------- */

const setLanguage = (locale, phrases) => ({
    type: SET_LANGUAGE,
    payload: {
        locale,
        phrases,
    },
});

const identityPromise = x => new Promise(res => res(x));

const performGetPhrases = (getPhrases, locale, dispatch) => {
    const localePromise = isString(locale) ? identityPromise(locale) : locale;
    localePromise.then(lc => {
        const phrases = getPhrases(lc);
        const phrasesPromise = isObject(phrases) ? identityPromise(phrases) : phrases;
        phrasesPromise.then(p => {
            dispatch(setLanguage(lc, p));
        });
    });
};

export const createPolyglotMiddleware = (catchedAction, getLocale, getPhrases) => {
    checkParams(catchedAction, getLocale, getPhrases);
    const catchedActions = isArray(catchedAction) ? catchedAction : [catchedAction];
    return ({ dispatch, getState }) => {
        checkState(getState());
        return next => action => {
            const isSetLocalAction = action.type === SET_LOCALE;
            if (catchedActions.includes(action.type) || isSetLocalAction) {
                const locale = isSetLocalAction ? action.payload : getLocale(action);
                performGetPhrases(getPhrases, locale, dispatch);
            }
            return next(action);
        };
    };
};
