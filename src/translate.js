import { connect } from 'react-redux';
import { getP } from './selectors';

const mapStateToProps = state => ({ p: getP(state) });
export const translate = connect(mapStateToProps);
