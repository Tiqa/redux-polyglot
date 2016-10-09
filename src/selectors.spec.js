import { toUpper, curry, evolve, is, pipe, values, all, equals } from 'ramda';
import { getP, getLocale } from './selectors';

const on = curry((x, f) => f(x));

const fakeState = {
    polyglot: {
        locale: 'fr',
        phrases: { hello: 'bonjour' },
    },
};

describe('selectors', () => {
    describe('getLocale', () => {
        it('doesn\'t crash when state is an empty object', () => {
            expect(getLocale({})).toBe(undefined);
        });

        it('doesn\'t crash when state is an empty object', () => {
            expect(getLocale(fakeState)).toBe('fr');
        });
    });

    describe('getP', () => {
        const p = getP(fakeState);

        it('gives a valid redux-polyglot object', () => {
            expect(
                on(p)(pipe(
                    evolve({
                        phrases: is(Object),
                        currentLocale: is(String),
                        allowMissing: is(Boolean),
                        warn: is(Function),
                        t: is(Function),
                        tc: is(Function),
                        tu: is(Function),
                        tm: is(Function),
                    }),
                    values,
                    all(equals(true)),
                ))
            ).toBe(true);
        });

        it('doesn\'t crash when state is an empty object', () => {
            expect(getP({})).toBe(undefined);
        });

        it('translates "hello" to "bonjour"', () => {
            expect(p.t('hello')).toBe('bonjour');
        });

        it('translates "hello" to "Bonjour" (capitalize)', () => {
            expect(p.tc('hello')).toBe('Bonjour');
        });

        it('translates "hello" to "BONJOUR" (upper-case)', () => {
            expect(p.tu('hello')).toBe('BONJOUR');
        });

        it('translates "hello" to "BONJOUR" (morphed with upper-case function)', () => {
            expect(p.tm(toUpper)('hello')).toBe('BONJOUR');
        });
    });
});
