import { connect } from 'react-redux';
import { getP } from './selectors';

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

const mapPolyglotToProps = options => state => ({ p: getP(state, options) });
const translate = (Component, options) => {
    const Connected = connect(mapPolyglotToProps(options))(Component);
    Connected.displayName = `Translated(${getDisplayName(Connected.WrappedComponent)})`;
    return Connected;
};

export default translate;
