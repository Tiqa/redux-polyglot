// import { createStore, combineReducers } from 'redux';

// import { polyglotReducer } from './reducer';
import { createPolyglotMiddleware } from './middleware';

// const createRootReducer = () => combineReducers({ polyglot: polyglotReducer });
// const createFakeStore = (middleware) => createStore(createRootReducer(), {}, middleware);

describe('middleware', () => {
    describe('errors', () => {
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
