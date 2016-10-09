/* eslint-disable max-len */
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { polyglotReducer } from './reducer';
import { createPolyglotMiddleware } from './middleware';

const CATCHED_ACTION = 'CATCHED_ACTION';
const OTHER_CATCHED_ACTION = 'OTHER_CATCHED_ACTION';
const UNCATCHED_ACTION = 'UNCATCHED_ACTION';

const spy = impl => {
    const fn = jest.fn().mockImplementation(impl);
    fn.constructor = Function; // for being appear like a vanilla JS Function.
    return fn;
};

const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
const createFakeStore = (getLocale, getPhrases) => {
    const middleware = createPolyglotMiddleware(
        [CATCHED_ACTION, OTHER_CATCHED_ACTION], getLocale, getPhrases
    );
    return createStore(createRootReducer(), {}, applyMiddleware(middleware));
};

describe('middleware', () => {
    let fakePhrases = { hello: 'hello' };
    const getLocale = spy(action => (action.payload && action.payload.locale) || 'en');
    const getPhrases = spy(() => new Promise((resolve) => (
        setTimeout(resolve, 1, fakePhrases)
    )));
    const fakeStore = createFakeStore(getLocale, getPhrases);

    beforeEach(() => {
        getLocale.mockClear();
        getPhrases.mockClear();
    });

    it('doesn\'t impact the store when action is unknown.', () => {
        const listener = spy(() => {
            expect(getLocale).not.toBeCalled();
            expect(getPhrases).not.toBeCalled();
            expect(fakeStore.getState()).toEqual({
                polyglot: { locale: null, phrases: null },
            });
        });
        const unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch({ type: UNCATCHED_ACTION });
        unsubscribe();
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('impacts the store when action is CATCHED_ACTION.', (cb) => {
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
                expect(getLocale).toBeCalledWith({ type: CATCHED_ACTION });
                expect(getPhrases).toBeCalledWith('en');
                expect(fakeStore.getState()).toEqual({
                    polyglot: { locale: 'en', phrases: { hello: 'hello' } },
                });
                unsubscribe();
                expect(listener).toHaveBeenCalledTimes(2);
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch({ type: CATCHED_ACTION });
    });

    it('impacts the store when locale is same as previous one.', (cb) => {
        const oldState = fakeStore.getState();
        fakePhrases = {};
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            expect(getLocale).toBeCalledWith({ type: CATCHED_ACTION, payload: { locale: 'fr' } });
            expect(getPhrases).toBeCalledWith('fr');
            if (counter === 2) {
                expect(fakeStore.getState()).not.toEqual(oldState);
                unsubscribe();
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch({ type: CATCHED_ACTION, payload: { locale: 'fr' } });
    });

    describe('Errors catching', () => {
        const errorMissing = 'polyglotMiddleware : missing parameters.';
        const errorFirst = 'polyglotMiddleware : first parameter must be a string or an array of string.';
        const errorSecond = 'polyglotMiddleware : second parameter must be a function.';
        const errorThird = 'polyglotMiddleware : third parameter must be a function.';

        const first = 'text';

        const second = () => true;
        const third = () => true;
        const _badParams_ = true; // eslint-disable-line no-underscore-dangle

        const createMiddleware = createPolyglotMiddleware;

        it('doesn\'t crash when all parameters are provided.', () => {
            createPolyglotMiddleware(first, second, third);
        });

        it('throws an error when createPolyglotMiddleware parameters are missing.', () => {
            expect(() => createPolyglotMiddleware()).toThrowError(errorMissing);
            expect(() => createPolyglotMiddleware(first)).toThrowError(errorMissing);
            expect(() => createPolyglotMiddleware(first, second)).toThrowError(errorMissing);
        });

        it('throws an error when first parameter is not a string or an array', () => {
            expect(() => createMiddleware(_badParams_, second, third)).toThrowError(errorFirst);
        });

        it('doesn\'t throw an error when first parameter is a string', () => {
            expect(() => createMiddleware(first, second, third)).not.toThrow();
        });

        it('doesn\'t throw an error when first parameter is an array', () => {
            expect(() => createMiddleware([], second, third)).not.toThrow();
        });

        it('throws an error when second parameter is not a string', () => {
            expect(() => createMiddleware(first, _badParams_, third)).toThrowError(errorSecond);
        });

        it('throws an error when thrid parameter is not a string', () => {
            expect(() => createMiddleware(first, second, _badParams_)).toThrowError(errorThird);
        });
    });
});
