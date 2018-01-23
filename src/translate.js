import curry from 'lodash.curry';
import { connect } from 'react-redux';
import { createGetP } from './selectors';
import { isFunction, isString, isObject } from './private/utils';

const getDisplayName = Component => (
    Component.displayName || Component.name || 'Component'
);

const mapPolyglotToProps = (options) => () => {
    const getP = createGetP();

    return state => ({
        p: getP(state, options),
    });
};

const translateEnhancer = curry((polyglotScope, Component) => {
    const Connected = connect(mapPolyglotToProps(polyglotScope))(Component);
    Connected.displayName = `Translated(${getDisplayName(Connected.WrappedComponent)})`;
    return Connected;
});

const translate = (fstArg, sndArg) => {
    if (fstArg === undefined && sndArg === undefined)
        return translateEnhancer({});

    else if (isFunction(fstArg))
        return translateEnhancer({}, fstArg);

    else if (isString(fstArg) && sndArg === undefined)
        return translateEnhancer({ polyglotScope: fstArg });

    else if (isObject(fstArg) && sndArg === undefined)
        return translateEnhancer(fstArg);

    return translateEnhancer(fstArg, sndArg);
};

export default translate;
