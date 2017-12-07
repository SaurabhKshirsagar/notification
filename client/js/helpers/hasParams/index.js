import R from 'ramda';
import assetProp from "helpers/assetprop";

let hasParams =R.compose(R.has("params"),assetProp);

export default hasParams;