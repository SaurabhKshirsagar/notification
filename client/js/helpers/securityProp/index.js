import R from 'ramda';
import assetProp from "helpers/assetprop";
// gets the "security" prop
let securityProp = R.compose(R.prop("security"), assetProp);
export default securityProp;