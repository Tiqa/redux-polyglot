import { toUpper } from 'ramda';
import { getP, getLocale } from './selectors';

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
