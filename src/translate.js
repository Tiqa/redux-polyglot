import { connect } from 'react-redux';
import { getP } from './selectors';

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

const mapStateToProps = state => ({ p: getP(state) });
const translate = Component => {
    const Connected = connect(mapStateToProps)(Component);
    Connected.displayName = `Translated(${getDisplayName(Connected.WrappedComponent)})`;
    return Connected;
};

export default translate;

