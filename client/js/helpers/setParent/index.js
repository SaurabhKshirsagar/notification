import R from 'ramda';
import contextProp from 'helpers/contextprop';
// sets "parent" prop in "props" as the value of the "context" prop
//let setParent = props =>R.assocPath(["parent"], contextProp(props), props);
//let setParent = props => R.assocPath(["asset", "props", "params", "Parent", "binding"], contextProp(props), props);
let setParent = props => R.assocPath(["params", "Parent", "binding"], contextProp(props), props);
export default setParent;