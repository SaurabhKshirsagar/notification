import R from 'ramda';
//import assetProp from 'helpers/assetProp';
import _ from "lodash";
let operation = R.compose(R.not,R.either(_.isArray,_.isUndefined)),
childrenIsNonArray =(props)=>operation(props.asset.props.children);
    // && !_.isUndefined(props.asset.props.children);
   // R.compose(R.type,R.compose(R.prop('children'),assetProp))

export default childrenIsNonArray;