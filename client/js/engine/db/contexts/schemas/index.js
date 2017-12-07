
import {DbContext} from "../../index";
import _ from "lodash";
import R from "ramda";

import stringJsonSchema from "helpers/typehandlers/stringhandler/schema";
import booleanJsonSchema from "helpers/typehandlers/booleanhandler/schema";
import numberJsonSchema from "helpers/typehandlers/numberhandler/schema";
import listJsonSchema from "helpers/typehandlers/listhandler/schema";
import complexJsonSchema from "helpers/typehandlers/complexhandler/schema";
import dictionaryJsonSchema from "helpers/typehandlers/dictionaryhandler/schema";
//import typehandlers from "helpers/typehandlers";

let entitySchemas = {
"string":stringJsonSchema,
"boolean":booleanJsonSchema,
"number":numberJsonSchema,
"list":listJsonSchema,
"complex":complexJsonSchema,
"dictionary":dictionaryJsonSchema
},

//@todo merge the schemaCustomization with the core schema 
resolveSchemaCustomization = (name, schemaOverride) => {
   let type = null;
   return _.merge(entitySchemas[name], schemaOverride);
},
getEntitySchema = (name, schemaOverride=null) => {
    return resolveSchemaCustomization(name, schemaOverride);
},
 loadEntitySchema = async (name) => {
    //no need the fetch schema for lowerCase(i.e. predefined) types
    if(name.toLowerCase() === name){
        return Promise.resolve(name);
    }
    let schema = getEntitySchema(name);
    if (!_.isEmpty(schema)) {
        return Promise.resolve(schema);
    }
    schema = await DbContext.get(['schemas', 'EntitySchemas', name]);
    
    
    entitySchemas[name] = schema;

    let {type = "complex"} = schema;
    switch (type) {
        case "complex":
            let {attributes} = schema;
            for (let child of attributes) {
                let {name,type:attributeType,of:of} = child;
                   
                   if(of){
                        await loadEntitySchema(of);
                        continue;
                   }
                   
                    await loadEntitySchema(attributeType);
            }
            break;
        case "dictionary":
        case "list":
            let {of:of} = schema;
            if(R.isNil(of)){
                of = schema.type;
            }           

            await loadEntitySchema(of);
            break;
       default:
        throw(`unsupported type ${type}`)
    }
    return schema;
}


// let hasDerrivedType = (type) => {
//     return typehandlers[type]?true:false;
// }


export {
     getEntitySchema,
     loadEntitySchema,
     entitySchemas
    };
