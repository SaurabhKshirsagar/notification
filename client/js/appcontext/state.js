import R from "ramda";
import _ from "lodash";
import actions from "appcontext/actions";
import Prop from "appcontext/prop.js";
import Immutable from "immutable";
import RProp from "appcontext/rProp.js";
import {ErrorTypes} from "helpers/BuilderApi";


import { fromModel, CoreTypes, inferredTypeIdentifier, getProp, inferSchema,getFieldValueAsJSON } from "helpers/BuilderApi";
import {getTypeHandler} from "helpers/createhandler";
let state = {
    "ApplicationContext": {
        "AuthState": {
        },
    }
},

    getLens = (propInstance, { parent = null, context = null, params=null } = {}) => {
        if (!Prop.isProp(propInstance)) {
            if (_.isString(propInstance) && !_.isEmpty(propInstance)) {
                //create the new Prop instance
                propInstance = new Prop(propInstance);
            } else {
                throw ("prop is not instance of the Prop class");
            }
        }
        let {key: path} = propInstance;
        let targetPath = path.replace(/\./g, ".value.");

        let pathArray = R.split(".", targetPath);

        if (R.isEmpty(pathArray)) {
            throw ("path is empty");
        }
        let lensArray = R.map(immLens, pathArray);
        //Case:1 :- Starts with a dot, e.g. ".A", or ".A.B.C" etc.
        if (R.isEmpty(R.head(pathArray))) {
            // return R.compose(context, R.apply(R.compose, R.tail(lensArray)));
           
            let result = null,
                firstKey = R.head(R.tail(path.split("."))),
                 childPath = _.drop(pathArray,4);
            if (params && params.hasOwnProperty(firstKey)) {
                let paramsLens = params[firstKey],
                withoutBlank = R.tail(lensArray),
                withoutValue = R.tail(withoutBlank),
                withoutFirstKeyPath = R.tail(withoutValue);

                result = R.compose(paramsLens, R.apply(R.compose, withoutFirstKeyPath));
                result.key = `${paramsLens.key}.${childPath}`;
                return result; 
            }
            result = R.compose(context, R.apply(R.compose, R.tail(lensArray)));
            result.key = `${context.key}${propInstance.key}`;
            return result;
        }
        //Case:2 :- Starts with something else, e.g. "A" or "A.B.C" etc, without a first dot.
        //return R.apply(R.compose, lensArray);
        let result = R.apply(R.compose, R.prepend(immLens("value"), lensArray));
        result.key = propInstance.key;
        return result;
    },
    immLens = key => {
        let result = R.lens((x) => {
            return x.get(key)
        }, (field, x) => {
            let setField = x.set(key, field);
            return setField;
        });
        //if value contains the schema then use that schema esle getSchema(key)
        result.key = key;
        return result;
    },
    mergeField = (field, value) => {
        if (R.isEmpty(value)) {
            return field;
        }

        let schema = field.get("schema"),
            type = getProp(schema, "type");

        if (schema && schema.toJSON){
            schema = schema.toJSON();
        }

        if ((type != CoreTypes.complex
            // @todo: replace hardcoded value with the correct constant.
            && type != CoreTypes["@complex"])
            || !_.isObject(value)) {
            throw "Unsupported type/value";
        }

        let valueKeys = Object.keys(value),
            schemaAttributes = getProp(schema, "attributes"),
            fieldValue = field.get("value");
        for (let key of valueKeys) {
            let childValue = value[key],
                keySchema = schemaAttributes ? schemaAttributes.filter(value => value.name == key) : inferSchema(childValue),
                childField = fieldValue ? fieldValue.get(key) : null;
            let {type} = keySchema;
            if (!childField) {
                let handler = getTypeHandler(type);
                childField = handler.fromValue(childValue, keySchema);
            }
            else {
                // the field already has a child of this key, try merging it.
                childField = mergeField(childField, childValue);
            }
            field = field.setIn(["value", key], childField);
        }
        return field;
    },
    merge = (lens, value, skipNotify = false) => {
        // 1. get the schema of the field at the lens
        // 2. Verify that both value and fields are objects.

        let field = getField(lens),
            result = mergeField(field, value);

        set(lens, result, null, skipNotify);
    },
    notify = (lens) => actions.notify(lens, state),
    p = pathInDotNotation => new Prop(pathInDotNotation),
    rp = pathInDotNotation => new RProp(pathInDotNotation),

    remove = lens => updateState(lens, R.set(lens, null, state)),
    set = (lens, value, schema, skipNotify = false) => {

        let target = getField(lens);
        // if the value is a field, set it directly
        // @todo: need to decide if the value should 
        // be checked for schema compatibility with the target.
        

        if (value && value.get && value.get("isField")) {
            if (!skipNotify){
                //console.info(`update state invoked for lens with key - ${lens.key}`);
                //console.info(value.toJSON ? value.toJSON() : value);
            }
            return updateState(lens, R.set(lens, value, state), skipNotify);
        }
        let targetSchema = schema || (target ? target.get("schema") : null);
        //let targetValue = fromModel(targetSchema, value);
        if(!targetSchema){
            targetSchema = inferSchema(value);
        }
        if (targetSchema.toJSON){
            targetSchema = targetSchema.toJSON();
        }
        let type = getProp(targetSchema,"type");
        let handler = getTypeHandler(type);
        
        // if(type === "list"){
        //      let of = getProp(targetSchema,"of");
        //     handler = getTypeHandler(of);
        // }
        
        let targetValue = handler.fromValue(value, targetSchema);

        if (!skipNotify){
            //console.info(`update state invoked for lens with key - ${lens.key}`);
            //console.info(value.toJSON ? value.toJSON() : value);
        }
        return updateState(lens, R.set(lens, targetValue, state), skipNotify);
    },//if schema the create the object of schema and value
    get = (lens, missingValue = null) => {
        let field = getField(lens),
        type = field.getIn(["schema","type"]);
        let  handler = getTypeHandler(type);
        return field ?handler.toJSON(field) : missingValue;
    },
    getField = (lens) => {
        let result = R.view(lens, state);
        if (result && !result.get("isField")) {
            throw `${lens.key} does not point to a field`;
        }
        return result;
    },
    setLensAnnotation = (lens, annotation) =>{
        let field = getField(lens);
        field = field.merge(Immutable.fromJS(annotation));
        //set(lens, field, null, true);
        set(lens, field, null);
    },
    getError = (lens) => getField(lens).get("error"),
    getSchema = (lens) => getField(lens).get("schema"),
    size = lens => _.size(get(lens)),
    updateState = (lens, inState, skipNotify = false) => {
        state = inState;
        if (!skipNotify){
            notify(lens);
        }
        let callSite = new Error().stack.substring(7);
        // console.info("In updateState, invoked from:");
        // console.info(callSite);
        // console.info("lens is " + lens.key);
        // console.info(state.toJSON());

        window.state = state;
        return state;
    },
    resolvePropToValue = (propCandidate, contextObj) => {
        if (Prop.isProp(propCandidate)) {
            let pathLens = getLens(propCandidate, contextObj);
            let value = get(pathLens);
            return value;
        }
        return propCandidate;
    },
    getFormattedValue = (field, formatOverride) => {
        let error = field.get("error");
        if (error && getProp(error,"type") == ErrorTypes.typeMismatch){
            let fieldValue = field.get("value");
            return fieldValue? (fieldValue.toJSON ? fieldValue.toJSON() : fieldValue) : null;
        }
        let handler = getTypeHandlerFromField(field);
        if(handler.getFormattedValue){
            return handler.getFormattedValue(field, formatOverride);
        }
        
        throw `The ${type} does not supported the format`;
    },
    getRawValue = (formattedValueAsString, field, formatOverride) =>{
        let handler = getTypeHandlerFromField(field);
        if(!handler.getRawValue){
            throw `The type "${type}" does not supported the format`;
        }
        try {
            return handler.getRawValue(formattedValueAsString, field, formatOverride)
        } catch (e){
            return formattedValueAsString;
        }
    },
    getTypeHandlerFromField = (field)=>{
        let schema = getProp(field,"schema");
        if(!schema){
             throw `Type handler is not defined for the ${type}`;
        }
        let type = getProp(schema,"type");
            let handler = getTypeHandler(type);
            return handler;
    };

// Transform state from JSON to Field based structure.
let stateSchema = inferSchema(state),
handler = getTypeHandler(getProp(stateSchema, "type"));
state = handler.fromValue(state);

module.exports = {
    p,
    rp,
    get,
    set,
    merge,
    size,
    remove,
    notify,
    getLens,
    getError,
    getField,
    getSchema,
    resolvePropToValue,
    setLensAnnotation,
    getFormattedValue,
    getRawValue,
    immLens
};
