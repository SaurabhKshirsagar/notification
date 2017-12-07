import { merge, getLens, Prop, get, set, setLensAnnotation  } from "appcontext";
import Promise from "bluebird";
import R from "ramda";
// mounts a new context on parent
let mountOwnContextOnParent = (inProps) => {
	//let {asset: {props: {id, displayName, params:{Parent:{binding}}}}, context, rest, uid} = inProps;
	
	let {id, displayName, params:{Parent:{binding}}, context, rest, uid} = inProps;

	merge(context, { [uid]: {} }, true);
	//set(context, { [uid]: {} });
	let contextLens = getLens(new Prop(`.${uid}`), {context});
	// add uiContext annotations for this lens field.
	setLensAnnotation(contextLens, {"uiContext":displayName});
	return Promise.resolve({ "asset": inProps.asset, context: contextLens, ...rest });
};
export default mountOwnContextOnParent;