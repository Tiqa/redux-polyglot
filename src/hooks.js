import { useSelector } from 'react-redux';
import { getP } from './selectors';

export const useP = config => useSelector(state => getP(state, config));
