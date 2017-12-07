import R from 'ramda';
import ObjectId from 'objectid-browser';

import assetProp from "helpers/assetprop";

// ensure that "id" is defined in "asset", if absent, set it as ObjectID
let assetHasId = R.compose(R.has("id"), assetProp),
setNewId = props => R.assocPath(["asset", "props", "_id"], ObjectId(), props),
//ensureId = R.when(assetHasId, setNewId);

ensureId =(props)=>{return props;}
export default ensureId;