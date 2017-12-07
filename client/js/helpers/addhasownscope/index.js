import R from 'ramda';

let addHasOwnScope = R.assocPath(["asset","props", "hasOwnScope"],true);

export default addHasOwnScope;