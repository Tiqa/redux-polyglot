/* eslint-disable max-len */
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { path } from 'ramda';
import configureStore from 'redux-mock-store';

import { createPolyglotMiddleware } from './middleware';

const CATCHED_ACTION = 'CATCHED_ACTION';
const OTHER_CATCHED_ACTION = 'OTHER_CATCHED_ACTION';
const UNCATCHED_ACTION = 'UNCATCHED_ACTION';

const fakePhrases = { hello: 'hello' };

const mockStore = configureStore([
    createPolyglotMiddleware(
        [CATCHED_ACTION, OTHER_CATCHED_ACTION],
        path(['payload', 'locale']),
        () => new Promise(resolve => setTimeout(resolve, 1000, fakePhrases))
    ),
]);

describe('middleware', () => {
    jest.useFakeTimers();

    it('doesn\'t impact the store when action is unknown.', (done) => {
        const store = mockStore({ polyglot: {} });
        store.dispatch({ type: UNCATCHED_ACTION });
        setImmediate(() => {
            expect(store.getActions()).toMatchSnapshot();
            done();
        });
    });

    it('impacts the store when action is CATCHED_ACTION.', (done) => {
        const store = mockStore({ polyglot: {} });
        store.dispatch({ type: CATCHED_ACTION, payload: { locale: 'en' } });
        jest.runAllTimers();
        setImmediate(() => {
            expect(store.getActions()).toMatchSnapshot();
            done();
        });
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

        describe('reducer', () => {
            const polyglotMiddleware = createPolyglotMiddleware([], () => 'en', () => Promise.resolve({}));
            const rootReducer = combineReducers({ test: (state = 42) => state });
            it('throws an error when polyglot is not in "state.polyglot"', () => {
                expect(() => {
                    createStore(rootReducer, {}, applyMiddleware(polyglotMiddleware));
                }).toThrowError('polyglotReducer : need to be store in "state.polyglot"');
            });
        });
    });
});
