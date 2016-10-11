/* eslint-disable max-len */
import { createStore, combineReducers, applyMiddleware } from 'redux';

import { polyglotReducer } from './reducer';
import { createPolyglotMiddleware } from './middleware';
import { setLocale } from './actions';

const CATCHED_ACTION = 'CATCHED_ACTION';
const OTHER_CATCHED_ACTION = 'OTHER_CATCHED_ACTION';
const UNCATCHED_ACTION = 'UNCATCHED_ACTION';

const spy = impl => jest.fn().mockImplementation(impl);

const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
const createFakeStore = (getLocale, getPhrases) => {
    const middleware = createPolyglotMiddleware(
        [CATCHED_ACTION, OTHER_CATCHED_ACTION], getLocale, getPhrases
    );
    return createStore(createRootReducer(), {}, applyMiddleware(middleware));
};

describe('middleware', () => {
    let fakePhrases = { hello: 'hello' };
    const getPhrases = () => fakePhrases;
    const getLocale = action => (action.payload && action.payload.locale) || 'en';
    const getAsyncLocale = (action => new Promise(resolve =>
        resolve(getLocale(action))
    ));
    const getAsyncPhrases = (() => new Promise((resolve) => (
        setTimeout(resolve, 1, fakePhrases)
    )));

    it('doesn\'t impact the store when action is unknown.', () => {
        const fakeStore = createFakeStore(getLocale, getPhrases);
        const listener = spy(() => {
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
        const fakeStore = createFakeStore(getLocale, getPhrases);
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
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
        const fakeStore = createFakeStore(getLocale, getPhrases);
        const oldState = fakeStore.getState();
        fakePhrases = {};
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
                expect(fakeStore.getState()).not.toEqual(oldState);
                unsubscribe();
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch({ type: CATCHED_ACTION, payload: { locale: 'fr' } });
    });

    it('impacts the store when a SET_LOCALE action is dispatched.', (cb) => {
        const fakeStore = createFakeStore(getLocale, getPhrases);
        const oldState = fakeStore.getState();
        fakePhrases = { test: 'test' };
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
                expect(fakeStore.getState()).not.toEqual(oldState);
                unsubscribe();
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch(setLocale('fr'));
    });

    it('impacts the store with an asynchronous getLocale()', (cb) => {
        const fakeStore = createFakeStore(getAsyncLocale, getPhrases);
        const oldState = fakeStore.getState();
        fakePhrases = { test: 'test' };
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
                expect(fakeStore.getState()).not.toEqual(oldState);
                unsubscribe();
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch(setLocale('fr'));
    });

    it('impacts the store with an asynchronous getPhrases()', (cb) => {
        const fakeStore = createFakeStore(getLocale, getAsyncPhrases);
        const oldState = fakeStore.getState();
        fakePhrases = { test: 'test' };
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
                expect(fakeStore.getState()).not.toEqual(oldState);
                unsubscribe();
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch(setLocale('fr'));
    });

    it('impacts the store with an asynchronous getLocale()/getPhrases', (cb) => {
        const fakeStore = createFakeStore(getAsyncLocale, getAsyncPhrases);
        const oldState = fakeStore.getState();
        fakePhrases = { test: 'test' };
        let counter = 0;
        let unsubscribe;
        const listener = spy(() => {
            counter += 1;
            if (counter === 2) {
                expect(fakeStore.getState()).not.toEqual(oldState);
                unsubscribe();
                cb();
            }
        });
        unsubscribe = fakeStore.subscribe(listener);
        fakeStore.dispatch(setLocale('fr'));
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

        it('doesn\'t throw an error when first parameter is a string or an array', () => {
            expect(() => createMiddleware(first, second, third)).not.toThrow();
            expect(() => createMiddleware([], second, third)).not.toThrow();
        });

        it('throws an error when first parameter is not a string or an array', () => {
            expect(() => createMiddleware(_badParams_, second, third)).toThrowError(errorFirst);
        });

        it('throws an error when second parameter is not a function', () => {
            expect(() => createMiddleware(first, _badParams_, third)).toThrowError(errorSecond);
        });

        it('throws an error when third parameter is not a function', () => {
            expect(() => createMiddleware(first, second, _badParams_)).toThrowError(errorThird);
        });

        describe('correct reducer', () => {
            const polyglotMiddleware = createPolyglotMiddleware([], getLocale, getPhrases);
            const rootReducer = combineReducers({ test: (state = 42) => state });
            it('throws an error when polyglot is not in "state.polyglot"', () => {
                expect(() => {
                    createStore(rootReducer, {}, applyMiddleware(polyglotMiddleware));
                }).toThrowError('polyglotReducer : need to be store in "state.polyglot"');
            });
        });
    });
});
