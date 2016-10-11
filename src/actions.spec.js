import { setLocale, SET_LOCALE, SET_LANGUAGE } from './actions';

describe('actions', () => {
    describe('constants', () => {
        it('defines SET_LANGUAGE', () => { expect(SET_LANGUAGE).toBeDefined(); });
        it('defines SET_LOCALE', () => { expect(SET_LOCALE).toBeDefined(); });
    });

    describe('action creators', () => {
        describe('setLocale', () => {
            it('returns a SET_LOCALE action without locale if not given', () => {
                const actionWithoutLocale = setLocale();
                expect(actionWithoutLocale).toEqual({
                    type: SET_LOCALE,
                });
            });
            it('returns a SET_LOCALE with locale in payload', () => {
                const actionWithoutLocaleAndPhrases = setLocale('yolo', 42);
                expect(actionWithoutLocaleAndPhrases).toEqual({
                    type: SET_LOCALE,
                    payload: 'yolo',
                });
            });
        });
    });
});
