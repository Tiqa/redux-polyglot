import { connect } from 'react-redux';
import { getP } from 'redux-polyglot/src/selectors';

const getDisplayName = Component => (
    Component.displayName || Component.name || 'Component'
);

const translate = (mapPhrasesToProps, options) => Component => {
    const mapStateToProps = mapPhrasesToProps
        ? state => mapPhrasesToProps(getP(state, options))
        : state => ({
            p: getP(state, options),
        });

    const Connected = connect(mapStateToProps)(Component);
    Connected.displayName = `Translated(${getDisplayName(Component)})`;
    return Connected;
};

export default translate;
