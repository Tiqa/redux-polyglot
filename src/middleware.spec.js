import { createStore, combineReducers, applyMiddleware } from 'redux';

import { polyglotReducer } from './reducer';
import { createPolyglotMiddleware } from './middleware';

const CATCHED_ACTION = 'CATCHED_ACTION';
const UNCATCHED_ACTION = 'UNCATCHED_ACTION';

const spy = impl => {
    const fn = jest.fn().mockImplementation(impl);
    fn.constructor = Function; // for being appear like a vanilla JS Function.
    return fn;
};

const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
const createFakeStore = (getLocale, getPhrases) => {
    const middleware = createPolyglotMiddleware(CATCHED_ACTION, getLocale, getPhrases);
    return createStore(createRootReducer(), {}, applyMiddleware(middleware));
};

describe('middleware', () => {
    let fakePhrases = { hello: 'hello' };
    const getLocale = spy(() => 'en');
    const getPhrases = spy(() => fakePhrases);
    const fakeStore = createFakeStore(getLocale, getPhrases);

    it('should do not impact the store when action is unknown.', () => {
        const unsubscribe = fakeStore.subscribe(() => {
            expect(fakeStore.getState()).toEqual({
                polyglot: { locale: null, phrases: null },
            });
        });
        fakeStore.dispatch({ type: UNCATCHED_ACTION });
        unsubscribe();
    });

    it('should impact the store when action is CATCHED_ACTION.', () => {
        const unsubscribe = fakeStore.subscribe(() => {
            expect(fakeStore.getState()).toEqual({
                polyglot: { locale: 'en', phrases: { hello: 'hello' } },
            });
        });
        fakeStore.dispatch({ type: CATCHED_ACTION });
        unsubscribe();
    });

    it('should not impact the store when locale is same.', () => {
        const unsubscribe = fakeStore.subscribe(() => {
            expect(fakeStore.getState()).toEqual({
                polyglot: { locale: 'en', phrases: { hello: 'hello' } },
            });
        });
        fakePhrases = null;
        fakeStore.dispatch({ type: CATCHED_ACTION });
        unsubscribe();
    });

    describe('catch errors', () => {
        const errorMissing = 'polyglotMiddleware : missing parameters.';
        const errorFirst = 'polyglotMiddleware : first parameter must be a string.';
        const errorSecond = 'polyglotMiddleware : second parameter must be a function.';
        const errorThird = 'polyglotMiddleware : third parameter must be a function.';

        const first = 'text';

        const second = () => true;
        const third = () => true;
        const _badParams_ = true; // eslint-disable-line no-underscore-dangle

        const createMiddleware = createPolyglotMiddleware;

        it('should not crash when parameters all parameters are provided.', () => {
            createPolyglotMiddleware(first, second, third);
        });

        it('should throw an error when createPolyglotMiddleware parameters are missing.', () => {
            expect(() => createPolyglotMiddleware()).toThrowError(errorMissing);
            expect(() => createPolyglotMiddleware(first)).toThrowError(errorMissing);
            expect(() => createPolyglotMiddleware(first, second)).toThrowError(errorMissing);
        });

        it('should throw an error when first parameter is not a string', () => {
            expect(() => createMiddleware(_badParams_, second, third)).toThrowError(errorFirst);
        });

        it('should throw an error when second parameter is not a string', () => {
            expect(() => createMiddleware(first, _badParams_, third)).toThrowError(errorSecond);
        });

        it('should throw an error when thrid parameter is not a string', () => {
            expect(() => createMiddleware(first, second, _badParams_)).toThrowError(errorThird);
        });
    });
});
