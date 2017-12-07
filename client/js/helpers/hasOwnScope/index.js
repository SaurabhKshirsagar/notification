import R from 'ramda';
import assetProp from 'helpers/assetprop';
// true if "asset" prop has "hasOwnScope" prop
//let hasOwnScope = R.compose(R.propEq("hasOwnScope", true), assetProp);
let hasOwnScope = (props)=>{return props}
export default hasOwnScope;