import Promise from 'bluebird';
import R from 'ramda';
// wraps a function's result inside Promise.resolve
let asPromise = f => R.compose(Promise.resolve.bind(Promise), f);
export default asPromise;