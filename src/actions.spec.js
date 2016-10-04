import { setLanguage } from './actions';
import { SET_LANGUAGE } from './constants';

describe('actions', () => {
    describe('setLanguage', () => {
        it('returns a SET_LANGUAGE without locale/phrases if not given', () => {
            const actionWithoutLocaleAndPhrases = setLanguage();

            expect(actionWithoutLocaleAndPhrases).toBeDefined();
            expect(actionWithoutLocaleAndPhrases).toEqual({
                type: SET_LANGUAGE,
                payload: {},
            });
        });
        it('returns a SET_LANGUAGE with locale/phrases', () => {
            const actionWithoutLocaleAndPhrases = setLanguage('yolo', 42);

            expect(actionWithoutLocaleAndPhrases).toBeDefined();
            expect(actionWithoutLocaleAndPhrases).toEqual({
                type: SET_LANGUAGE,
                payload: {
                    locale: 'yolo',
                    phrases: 42,
                },
            });
        });
    });
});
