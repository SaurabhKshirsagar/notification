import R from 'ramda';
import assetProp from "helpers/assetprop";
let hasVars=R.compose(R.has("vars"),assetProp);
//let hasVars=(props)=>props;
export default hasVars;