import _ from 'lodash';
import Promise from 'bluebird';
import { set, getLens, Prop } from "appcontext";

let mountParams = (inProps) => {
	//let {asset: {props: {params}}, parent, context, ...rest} = inProps,
	let {asset: {props: {params}}, context, ...rest} = inProps,
	{asset: {props: {params:{Parent:{binding}}}}} = inProps,
		mountedParams = {};
	_.forEach(params, function (value, key) {
		if (typeof (value.binding) != "function") {
				let lens = getLens(new Prop(`.${key}`), { context, "params": inProps.params }),
				{binding, ...schema} = value;
				set(lens, binding, schema);
			}
			else{
				mountedParams[key] = value.binding;
			}
	});
	inProps.asset.props.params = mountedParams;
	return Promise.resolve(inProps);	
};
export default mountParams;