import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { getLocale, getP, getPhrases } from './selectors';

const areConfigsEqual = (prevConfig = {}, nextConfig = {}) => {
    const prevKeys = Object.keys(prevConfig);
    const nextKeys = Object.keys(nextConfig);

    return (
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => prevConfig[key] === nextConfig[key])
    );
};

export const useP = (config) => {
    const configRef = useRef(config);
    const localeRef = useRef();
    const phrasesRef = useRef();
    const pRef = useRef();

    return useSelector((state) => {
        const locale = getLocale(state);
        const phrases = getPhrases(state);

        if (
            !pRef.current ||
            localeRef.current !== locale ||
            phrasesRef.current !== phrases ||
            !areConfigsEqual(configRef.current, config)
        ) {
            localeRef.current = locale;
            phrasesRef.current = phrases;
            configRef.current = config;
            pRef.current = getP(state, config);
        }

        return pRef.current;
    });
};
