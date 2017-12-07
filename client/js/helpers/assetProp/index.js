import R from 'ramda';
import propsProp from "helpers/propsprop";
// gets the value of "asset" prop
let assetProp = R.compose(propsProp,R.prop("asset"));
export default assetProp;