import * as all from './';

describe('index', () => {
    it('exports middleware', () => {
        expect(all.polyglotMiddleware).toBeDefined();
    });
    it('exports SET_LANGUAGE action', () => {
        expect(all.SET_LANGUAGE).toBeDefined();
    });
    it('exports setLanguage action creator', () => {
        expect(all.setLanguage).toBeDefined();
    });
    it('exports reducer', () => {
        expect(all.polyglotReducer).toBeDefined();
    });
    it('exports selectors', () => {
        expect(all.getP).toBeDefined();
        expect(all.getLocale).toBeDefined();
    });
});
