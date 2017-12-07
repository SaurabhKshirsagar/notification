import R from 'ramda';
import checkSecurity from 'helpers/checksecurity';
// true if all preconditions pass
let checkAssetPreconditions = R.allPass([checkSecurity]);
export default checkAssetPreconditions;