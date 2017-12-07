import _ from 'lodash';
import Promise from 'bluebird';
import R from "ramda";
import Immutable, {Iterable,Map,List} from "immutable";
import { DbContext } from '../../engine/Db';
import {getEntitySchema,loadEntitySchema} from 'engine/Db/contexts/schemas';
import builder from '../schemaBuilders/entityBuilder';


const schemaBuilder = builder(),

// http://www.bennybottema.com/2016/03/14/enums-in-javascript-with-lodash/
    ErrorTypes = _.keyBy([
    "memberError",
    "typeMismatch",
    "required",
    "minLength",
    "maxLength",
    "min",
    "max",
    "patternValidation",
    "domainError",
    "other",
    "keyMissMatch"

]),
inferredTypeIdentifier = "@",
// Supported data types.
CoreTypes = _.keyBy([
    `${inferredTypeIdentifier}string`,
    `${inferredTypeIdentifier}number`,
    `${inferredTypeIdentifier}boolean`,
    `${inferredTypeIdentifier}complex`,
    `${inferredTypeIdentifier}array`,
    "string",
    "number",
    "yesno",
    "date",
    "datetime",
    "complex",
    "boolean",
    "list",
    "dictionary"
]),

validations = _.keyBy([
    "required",
    "min",
    "max",
    "minLength",
    "maxLength"
]),
makeField = (value, schema, error = null) =>Immutable.fromJS(
    {
        value,
        error,
        schema,
        isField:true

    }),

getTypeDefault = R.memoize((schema) => {
    let type = getProp(schema,"type") || "complex",
        defaultValue =  getProp(schema,"defaultValue") || null,
        attributes = getProp(schema,"attributes") || {};

    // @todo: return default value based on schema.type.
    switch (type) {
        case "list": return Immutable.List([]);
        case "complex": {
            return _.mapValues(attributes, (value, key) => Immutable.fromJS(createDefault(value)));
        }
        default: break;
    }
    return defaultValue;
}),
createDefault = (schema) => {
      let value = getTypeDefault(schema);
    return makeField(value, schema);
},
inferSchema = (value) => {
    let type = typeof value, schema = {};
    switch (type) {
        case "number":
        case "boolean":
        case "string": schema.type = `${inferredTypeIdentifier}${type}`;
            break;
        case "object":
            if (_.isArray(value)) {
                schema.type = `${inferredTypeIdentifier}array`;
                break;
            }
            schema.type = `${inferredTypeIdentifier}complex`;
            break;
    }
    return schema;
},
isInferredType = (type) => {
    if(type){
        return type[0] == inferredTypeIdentifier
    }else{
        return false;
    }

},

createErrorMessage = function(typeHandler,format){
       if(R.isEmpty(this.placeholders) || R.isNil(this.placeholders)){
           return this.messageTemplate;
       }
       var keys = Object.keys(this.placeholders);
       let message = this.messageTemplate;

       for(let key of keys){
          let replacer = this.placeholders[key];
           if(typeHandler){
                replacer = typeHandler.getFormattedValue(null,format,this.placeholders[key]);
            }
          message = message.replace(`\{${key}\}`,replacer);
       }
       return message;
   },

makeError = (type, message,placeholders, ...other) => ({
   "type":type,
   "messageTemplate":message,
   "placeholders":placeholders,
   "toString":createErrorMessage
}),
 
tryValidate = R.curry((validationFunc, value, error, schema) => {
    if (validationFunc(value)){
        error = null;
    }
    return makeField(value, schema, error);
}),
getJSONSchema = (schema) => schema.toJSON ? schema.toJSON() : schema,

getProp = (obj,key) => {
    if(R.isNil(obj)){
        return null;
    }
    if(Iterable.isIterable(obj)){
        return obj.get(key);
    }
    return obj[key];
},
getFieldValueAsJSON=(obj)=>{
     let type = obj ?obj.get("schema").get("type"):"";
     let value =obj.get("value");
        if(_.isObject(obj.get("value")) && (obj.get("value").size === 0)){
            return newEmpty(obj.get("value"));
        }
        switch(type){
            case CoreTypes[`string`]:
            case CoreTypes[`${inferredTypeIdentifier}string`]:
            case CoreTypes.boolean:
            case CoreTypes[`${inferredTypeIdentifier}boolean`]:
            case CoreTypes[`number`]:
            case CoreTypes[`${inferredTypeIdentifier}number`]:
                return value;
            //for type Array
            case CoreTypes.array:
            case CoreTypes[`${inferredTypeIdentifier}array`]:
                if(List.isList(value))
                    return value.map((element)=>getFieldValueAsJSON(element)).toJSON();
                return value;
            //for type Object
            case CoreTypes.complex:
            case CoreTypes[`${inferredTypeIdentifier}complex`]:
                let objVal={};
                if(Map.isMap(value)){
                    let keySeq = obj.get("value").entrySeq();
                    for(let child of keySeq){
                        let [key,value]= child;
                        _.set(objVal,[key],getFieldValueAsJSON(value));
                    }
                    return objVal;
                }
                return value;

            default:
               // throw `${type} type not supported`
        }
},
newEmpty = (obj) => Map.isMap(obj)?{}:[];

module.exports = {
    createDefault,
    
    CoreTypes,
    inferredTypeIdentifier,
    ErrorTypes,
    getProp,
    inferSchema,
    makeError,
    getFieldValueAsJSON,
    makeField,
    tryValidate
}









