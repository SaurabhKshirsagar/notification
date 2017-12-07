import R from 'ramda';
import asPromise from 'helpers/aspromise';
import hasRef from 'helpers/hasref';
import fetchAndConcileAsset from 'helpers/fetchandconcileasset';
// fetches and reconciles ref asset if "asset" prop has "ref"
let fetchRefAssetIfDefined = R.ifElse(hasRef, fetchAndConcileAsset, asPromise(R.identity));
export default fetchRefAssetIfDefined;