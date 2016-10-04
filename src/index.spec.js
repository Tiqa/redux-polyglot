import * as all from './';

describe('index', () => {
    it('exports middleware', () => {
        expect(all.polyglotMiddleware).toBeDefined();
    });
});
