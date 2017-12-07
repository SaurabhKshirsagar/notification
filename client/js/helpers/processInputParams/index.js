import _ from "lodash";
import Promise from 'bluebird';
import { exEvaluator } from 'actions/exEvaluator.js';
import { get, getLens, Prop } from "appcontext/";
import RProp from "appcontext/rProp.js";

let processInputParams = async (inProps) => {
	let {asset: {props: {params}}} = inProps,
		keys = Object.keys(params),
		{asset:{props:{params:{parent}}}} = inProps,
		result = {};
	
	for (let key of keys) {
		let param = params[key],
			expression = param.binding,
			evaluationResult = null;
		try {

			if(typeof(expression) != "function"){
				evaluationResult = await exEvaluator(expression);
			}
			else{
				evaluationResult = expression; 
			}
		} catch (e) {
			throw e;
		}
		if (Prop.isProp(evaluationResult)) {
			//let lens = getLens(instance, { parent, context }),
			let value = getLens(instance, { parent, context });
				// value = get(lens);
				result[key] = { "binding": value };
		}
		// else if (RProp.isRProp(evaluationResult)) {
		// 	result[key] = {"binding": inProps[evaluationResult.key]};
		// }
		else {
			result[key] = { "binding": evaluationResult };
		}
	}
	inProps.asset.props.params = _.merge({}, inProps.asset.props.params, result);
	//inProps.asset.props.params = result;

	return inProps;
}
export default processInputParams;
