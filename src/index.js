import PropTypes from 'prop-types';

const PropType = PropTypes.shape({
    t: PropTypes.func.isRequired,
    tc: PropTypes.func.isRequired,
    tt: PropTypes.func.isRequired,
    tu: PropTypes.func.isRequired,
    tm: PropTypes.func.isRequired,
});

export * from './middleware';
export * from './actions';
export * from './constants';
export * from './reducer';
export * from './selectors';
export * from './hooks';
export { PropType };
