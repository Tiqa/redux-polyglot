import Polyglot from 'node-polyglot';

declare module '@cabify-dev/redux-polyglot' {
    export type PolyglotInterpolationOptions = Polyglot.InterpolationOptions;

    export type translate = (
        phrase: string,
        smartCountOrInterpolationOptions: number | PolyglotInterpolationOptions
    ) => string;

    interface SimpleAction {
        type: string;
        payload: {
            [varName: string]: any;
        };
    }

    export type getLocaleFunction = (action: SimpleAction) => string;
    export type getPhrasesFunction = (locale: string) => Promise<any>;

    export interface ReduxPolyglot {
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
    declare function getP(scope: string): ReduxPolyglot;
    declare function createPolyglotMiddleware(
        actionsToCatch: [string],
        getLocale: getLocaleFunction,
        getPhrases: getPhrasesFunction
    );
}
