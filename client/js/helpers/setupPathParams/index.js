import Promise from 'bluebird';
import _ from 'lodash';
import {set} from 'appcontext';
let setupPathParams= (props) =>{
	let {params, ...wrappedProps} = props;
	// extract path params from the props of the wrapped component
	let {context, asset:{props:{path:{params:pathParams}}}} = wrappedProps;
	// for each of the path param, mount the value in the corresponding
	// component param.
	return Promise.all(_.map(pathParams, (value, key) => {
		set(R.lensPath([context, key]), params[value]);
	}))
	.then(() => props);
}
export default setupPathParams;