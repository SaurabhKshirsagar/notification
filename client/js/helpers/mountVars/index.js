import R from 'ramda';
import {set, merge, get, getLens, Prop} from "appcontext";
import _ from 'lodash';

import {getEntitySchema,loadEntitySchema} from "engine/Db/contexts/schemas"
let mountVars = async (inProps) => {
    let {asset: {props: {vars}}, parent, context, rest} = inProps,
        varsToMount = {};
    for (let key in vars) {
        let schemaOverride = vars[key],
            {type,of} = schemaOverride;
        
        if(type === "list" || type === "dictionary"){
            await loadEntitySchema(of);
        }
        
        await loadEntitySchema(type);

        let lens = getLens(`.${key}`, { context }),
            mountValue = schemaOverride.defaultValue ? schemaOverride.defaultValue : null;
        set(lens, mountValue, schemaOverride);
    }

    return Promise.resolve({ "asset": inProps.asset, "parent": parent, context: context, rest });

/*=======
let mountVars=(inProps)=>{
    //let {asset: {props: {vars}}, parent, context, ...rest} = inProps,
    let {asset: {props: {vars}}, context, ...rest} = inProps,
    {asset:{props:{params:{Parent:{binding}}}}} = inProps,
    varsToMount = {};
	// return set(parent, id, {})
	// 	   .then(ctx => ({"asset" : asset, "parent" : parent, context : ctx, rest}));
	//let result = set(parent,R.assoc(id,{},{}));
    //let result = set(context,);
    _.forEach(vars,function(value,key){
       // @todo off is being ignored over here.
       switch(value.type.toLowerCase()){
            case "string":
                        varsToMount[key] = value.defaultValue ? value.defaultValue : "";
                    break;
            case "list":
                        varsToMount[key] = value.defaultValue ? value.defaultValue : [];
                    break;
            case "object":
                        varsToMount[key] = value.defaultValue ? value.defaultValue : {};
                    break;
       }
    });
    //console.log(get(context));
    merge(context,varsToMount);
	return Promise.resolve({"asset" : inProps.asset, "parent" : binding, context : context, ...rest});
>>>>>>> P10Architecture*/
};

export default mountVars;