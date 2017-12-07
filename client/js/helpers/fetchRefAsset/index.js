import refProp from "helpers/refprop";
import R from 'ramda';
import appAsset from "engine/applicationasset";


// fetches asset specified in the "ref" prop
//let fetchRefAsset = (props) =>appAsset.loadAsset(["assets"].concat(R.split('/')(refProp(props))));
let fetchRefAsset = (props) =>{return new Promise((resolve,reject)=>resolve(props))};
export default fetchRefAsset;