import R from 'ramda';
import assetProp from "helpers/assetprop";
// true if "asset" prop has "ref" in it


//let hasRef =R.compose(R.has("ref"), assetProp);
let hasRef =(props)=>props;
export default hasRef;