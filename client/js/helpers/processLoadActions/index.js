import Promise from 'bluebird';
import {onProcessActions} from 'actions/exEvaluator.js'
// process "load" actions
let processLoadActions = inProps => {
	let {context, parent, asset:{props:{actions}}} = inProps;
	if (actions && actions.load){
		return onProcessActions(actions.load,{context:context, parent:parent})
		.then((result) => inProps);
	}
	return Promise.resolve(inProps);
};
export default processLoadActions;