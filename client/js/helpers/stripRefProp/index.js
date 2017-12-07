// import R from 'ramda';
// let setDisplayName = (props) =>{
//     let ref = R.path(["asset","props", "ref"], props);
//     return R.assocPath(["asset", "props", "displayName"], ref, props);
// }
// // removes "ref" from "asset" prop
// let stripRefProp = R.compose(R.dissocPath(["asset","props", "ref"]), setDisplayName);
// export default stripRefProp;



import R from 'ramda';
let setDisplayName = (props) =>{
    let ref = R.path(["ref"], props);
    return R.assocPath(["displayName"], ref, props);
}
// removes "ref" from "asset" prop
let stripRefProp = R.compose(R.dissocPath(["props", "ref"]), setDisplayName);
export default stripRefProp;