import Polyglot from 'node-polyglot';

declare module '@cabify-dev/redux-polyglot' {
    type PolyglotInterpolationOptions = Polyglot.InterpolationOptions;

    type translate = (
        phrase: string,
        smartCountOrInterpolationOptions?: number | PolyglotInterpolationOptions
    ) => string;

    interface SimpleAction {
        type: string;
        payload: {
            [varName: string]: any;
        };
    }

    type getLocaleFunction = (action: SimpleAction) => string;
    type getPhrasesFunction = (locale: string) => Promise<any>;

    interface ReduxPolyglot {
        t: translate;
        tc: translate;
        tm: translate;
        tu: translate;
        ut: translate;
        has: (scope: string) => boolean;
        locale: () => string;
        extend: (phrases: any) => void;
        getDeeperScope: (scope: string) => Polyglot;
    }
    function getP(scope: string): ReduxPolyglot;
    function createPolyglotMiddleware(
        actionsToCatch: [string],
        getLocale: getLocaleFunction,
        getPhrases: getPhrasesFunction
    );

    interface PolyglotState {
        locale: string;
        phrases: any;
    }

    function polyglotReducer(
        state: PolyglotState = { locale: null, phrases: null },
        action: SimpleAction
    ): PolyglotState;
}
