import Polyglot from 'node-polyglot';

declare module '@cabify-dev/redux-polyglot' {
    export interface PolyglotScopeVars {
        [varName: string]: string | number;
    }
    export type translateSimple = (phrase: string) => string;
    export type translateSmartCount = (phrase: string, smartCount: number) => string;
    export type translateInterpolations = (
        phrase: string,
        interpolationOptions: Polyglot.InterpolationOptions
    ) => string;
    export type translate = translateSimple | translateSmartCount | translateInterpolations;

    interface SimpleAction {
        type: string;
        payload: {
            [varName: string]: any;
        };
    }

    export type getLocaleFunction = (action: SimpleAction) => string;
    export type getPhrasesFunction = (locale: string) => Promise<any>;

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
    declare function getP(scope: string): ReduxPolyglot;
    declare function createPolyglotMiddleware(
        actionsToCatch: [string],
        getLocale: getLocaleFunction,
        getPhrases: getPhrasesFunction
    );
}
