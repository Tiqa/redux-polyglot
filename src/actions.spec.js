import { setLocale } from './actions';
import { SET_LOCALE } from './constants';

describe('actions', () => {
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
