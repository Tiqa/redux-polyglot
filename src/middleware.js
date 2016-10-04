import { setLanguage } from './actions';

export const polyglotMiddleware = (catchedActionType, getLocale, getPhrases) => {
    if (!catchedActionType || !getLocale || !getPhrases)
        throw (new Error('polyglotMiddleware : missing parameters.'));
    return store => next => action => {
        if (catchedActionType === action.type) {
            const locale = getLocale(action);
            const previousLocale = store.getState().polyglot.locale;
            if (previousLocale !== locale) {
                const phrases = getPhrases(locale);
                store.dispatch(setLanguage(locale, phrases));
            }
        }
        return next(action);
    };
};
