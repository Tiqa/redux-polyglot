import curry from 'lodash.curry';
import { connect } from 'react-redux';
import { getP } from './selectors';
import { isFunction, isString, isObject } from './private/utils';

const getDisplayName = Component => (
    Component.displayName || Component.name || 'Component'
);

const mapPolyglotToProps = polyglotScope => state => ({
    p: getP(state, polyglotScope)
});

const translateEnhancer = curry((polyglotScope, Component) => {
    const Connected = connect(mapPolyglotToProps(polyglotScope))(Component);
    Connected.displayName = `Translated(${getDisplayName(Connected.WrappedComponent)})`;
    return Connected;
});

const translate = (fstArg, sndArg) => {
    if (fstArg === undefined && sndArg === undefined)
        return translateEnhancer('');
    else if (isFunction(fstArg))
        return translateEnhancer('', fstArg);
    else if ((isString(fstArg) || isObject(fstArg)) && sndArg === undefined)
        return translateEnhancer(fstArg);
    return translateEnhancer(fstArg, sndArg);
};

export default translate;
