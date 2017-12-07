import R from 'ramda';
import assetProp from 'helpers/assetprop';
// gets the value of "ref" in "asset"
let refProp = R.compose(R.prop("ref"), assetProp);
export default refProp;