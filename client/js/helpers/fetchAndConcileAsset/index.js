import R from 'ramda';
import _ from 'lodash';
import fetchRefAsset from "helpers/fetchrefasset";
import stripRefProp from "helpers/striprefprop";
import addHasOwnScope from "helpers/addhasownscope";

// fetched ref asset, then merges it with the existing asset and removed the "ref" prop
let fetchAndConcileAsset = (props) => fetchRefAsset(props)
//	.then(asset => _.merge({},{asset}, props))
	//.then(stripRefProp)
	.then(addHasOwnScope);


	
	//fetch refrence Assets
	// .then Merge Fetched props with orignal Assets
	// .then remove "ref" props from main asset
	// .then add hasOwnScope property to true coz its an "ref" asset. 
	
export default fetchAndConcileAsset;