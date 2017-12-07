import R from 'ramda';
import assetProp from 'helpers/assetprop';
// true if "asset" prop has "security" prop
let hasSecurity = R.compose(R.has("security"), assetProp);
export default hasSecurity;