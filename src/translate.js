import curry from 'lodash.curry';
import { connect } from 'react-redux';
import { getP } from './selectors';

// eslint-disable-next-line valid-typeof
const is = type => x => typeof x === type;
const isString = is('string');
const isFunction = is('function');

const getDisplayName = Component => (
    Component.displayName || Component.name || 'Component'
);

const mapPolyglotToProps = polyglotScope => state => ({
    p: getP(state, polyglotScope),
});

const translateEnhancer = curry((polyglotScope, Component) => {
    const Connected = connect(mapPolyglotToProps(polyglotScope))(Component);
    Connected.displayName = `Translated(${getDisplayName(Connected.WrappedComponent)})`;
    return Connected;
});

const translate = (fstArg, sndArg) => {
    if (isFunction(fstArg))
        return translateEnhancer('', fstArg);
    else if (isString(fstArg) && sndArg === undefined)
        return translateEnhancer(fstArg);
    return translateEnhancer(fstArg, sndArg);
};

export default translate;
